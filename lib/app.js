import express from 'express'
import bodyParser from 'body-parser'
import config from './core/config'
import init from './core/init'
import hue from './hue/resource'
import twitter from './twitter/resource'
import cors from 'cors'
import HueTwitterApp from './twitter/app'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/_health', (req, res) => res.end('ok'))
app.use('/favicon.ico', (req, res) => res.end())
app.use('/hue', hue)
app.use('/twitter', twitter)

const port = config.get('PORT')

init().catch(e => {
  process.exit(1)
}).then(() => {
  app.listen(port, () => {
    console.log('LISTENING ON PORT ', port)
    const hueTwitterSvc = new HueTwitterApp()
    hueTwitterSvc.init()
  })
})
