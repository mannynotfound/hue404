import {getStream, getWhiteList} from './'
import {getAllLights, changeLight} from '../hue'
import {keys, sample, merge, shuffle} from 'lodash'
import cfg from '../core/config'
import Emitter from '../core/emitter'
import 'colors'

export default class HueTwitter {
  async init() {
    console.log('')
    console.log('STARTING SVC ... '.cyan)

    this.user_id_str = cfg.get('TWITTER_USER_ID_STR')
    this.hueColors = require('../hue/colors')

    this.whiteList = await getWhiteList()
    console.log('GOT WHITELIST ... '.green.bold)

    this.stream = await getStream()
    console.log('GOT STREAM ... '.green.bold)

    this.allLights = await getAllLights()
    console.log('GOT LIGHTS ... '.green.bold)

    this.running = false
    Emitter.on('start', () => {
      if (!this.running) {
        this.startStream()
      }
    })

    Emitter.on('stop', () => {
      this.stopStream()
    })
  }

  stopStream() {
    this.handleTweet({
      'in_reply_to_user_id_str': this.user_id_str,
      'text': 'lights off',
      'user': {
        'screen_name': sample(this.whiteList)
      }
    })

    this.running = false
  }

  startStream() {
    this.running = true
    console.log('STARTING HUE TWITTER STREAM ~~~ '.rainbow.bold)
    console.log('')
    this.randomColor()
    if (this.randomTimer) clearInterval(this.randomTimer)
    this.randomTimer = setInterval(this.randomColor.bind(this), 60000 * 5)
    this.stream.on('data', this.handleTweet.bind(this))
    this.stream.on('error', this.handleError.bind(this))
  }

  checkMention(tweet) {
    return tweet.in_reply_to_user_id_str === this.user_id_str
  }

  randomColor() {
    this.handleTweet({
      'in_reply_to_user_id_str': this.user_id_str,
      'text': 'random',
      'user': {
        'screen_name': sample(this.whiteList)
      }
    })
  }

  findRandom(text) {
    return text.toLowerCase().indexOf('random') > -1;
  }

  findColors(text) {
    const availableColors = keys(this.hueColors)
    const colorsArr = []

    availableColors.forEach(function(c) {
      if (text.indexOf(c) > -1) {
        colorsArr.push(c)
      }
    })

    return colorsArr.length ? colorsArr : null
  }

  findToggle(text) {
    if (text.toLowerCase().indexOf('lights off') > -1) {
      return 'off'
    } else if (text.toLowerCase().indexOf('lights on') > -1) {
      return 'on'
    }

    return null
  }

  createConfig(allLights, type, options) {
    const config = []

    if (type === 'toggle') {
     allLights.forEach((a) => {
        config.push({
          'num': a.id,
          'state': {
             'on': options === 'on'
          }
        })
      })
    } else if (type === 'colors') {
      console.log('USING COLORS '.rainbow.bold, options)
      console.log('')
      const lightNums = allLights.map((l) => l.id)
      const lights = shuffle(lightNums)
      const chunks = Math.ceil(lights.length / options.length)
      const chunkArrs = []

      while(lights.length) {
        chunkArrs.push(lights.splice(0, chunks))
      }

      chunkArrs.forEach((chunk, i) => {
        chunk.forEach((num, k) => {
          const opt = options[i] || sample(options)
          const color = this.hueColors[opt] || this.hueColors[sample(keys(this.hueColors))]
          const state = merge({'on': true}, color)

          config.push({
            'num': num,
            'state': state
          })
        })
      })
    }  else if (type === 'random') {
      console.log('USING RANDOM'.rainbow.bold)
      console.log('')
      const randAmt = 1 + sample([1, 2, 3, 4])
      const randColors = []

      for (let n = 0; n < randAmt; n++) {
        const randColor = sample(keys(this.hueColors))
        console.log('ADDING RANDOM COLOR ', randColor)
        randColors.push(randColor)
      }

      allLights.forEach((a) => {
        config.push({
          'num': a.id,
          'state': merge({'on': true}, this.hueColors[sample(randColors)])
        })
      })
    }

    return config
  }

  async changeLights(config) {
    this.changing = true

    let changed = 0

    config.forEach(async function(c) {
      console.log(
        'CHANGING LIGHT '.yellow,
        '[ '.magenta,
        c.num.toString().magenta,
        ' ]'.magenta
      )

      setTimeout(async function() {
        await changeLight(c.num, JSON.stringify(c.state))
      }, Math.floor(Math.random() * 5000))
    })

    console.log('')
    this.changing = false
  }

  handleTweet(tweet) {
    console.log('HANDLING TWEET !'.cyan.underline, tweet.text.white)
    console.log('')
    const isMention = this.checkMention(tweet)
    if (!isMention || !this.running) return

    const colors = this.findColors(tweet.text)
    const toggle = this.findToggle(tweet.text)
    const random = this.findRandom(tweet.text)

    switch(true) {
      // whitelist toggle func
      case (toggle && this.whiteList.indexOf(tweet.user.screen_name) === -1):
      case (!colors && !toggle && !random):
      case (this.changing):
        return
      default:
        break
    }

    let type
    if (toggle) type = 'toggle'
    else if (colors) type = 'colors'
    else if (random) type = 'random'

    const options = toggle || random || colors
    const config = this.createConfig(this.allLights, type, options)

    if (config) {
      this.changeLights(config)
    }
  }

  handleError(error) {
    console.log(JSON.stringify(error, 0, 2).red.bold)
  }
}
