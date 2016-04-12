import config from '../core/config'
import Twitter from 'twitter'

const client = new Twitter({
  consumer_key: config.get('TWITTER_CONSUMER_KEY'),
  consumer_secret: config.get('TWITTER_CONSUMER_SECRET'),
  access_token_key: config.get('TWITTER_ACCESS_TOKEN_KEY'),
  access_token_secret: config.get('TWITTER_ACCESS_TOKEN_SECRET')
})

const promTwit = (method, url, params = {}) => {
  return new Promise((resolve, reject) => {
    client[method](url, params, (error, data) => {
      if (error && !!error.on) return resolve(error) // edge case cuz stream doesnt cb error
      else if (error) return reject(error)
      return resolve(data)
    })
  })
}

export async function getStream() {
  const stream = await promTwit('stream', 'statuses/filter', {
    follow: config.get('TWITTER_USER_ID_STR')
  })

  return stream
}

export async function getWhiteList() {
  const whitelist = await promTwit('get', 'lists/members', {
    slug: config.get('TWITTER_WHITE_LIST'),
    owner_screen_name: config.get('TWITTER_USER_NAME')
  })

  return whitelist.users.map((u) => u.screen_name)
}
