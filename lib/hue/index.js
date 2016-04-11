import config from '../core/config'
import huejay from 'huejay'
import {merge} from 'lodash'

let client = new huejay.Client({
  host: config.get('HUE_ADDRESS'),
  username: config.get('HUE_USERNAME')
})

async function createUser() {
  let user = new client.users.User
  user.deviceType = 'hueTwitter'

  client.users.create(user)
    .then(user => {
      console.log(`New user created - Username: ${user.username}`)
      return user
    })
    .catch(error => {
      if (error instanceof huejay.Error && error.type === 101) {
        return console.log(`Link button not pressed. Try again...`)
      }

      console.log(error.stack)
    })
}

export async function getAllLights() {
  const allLights = await client.lights.getAll()
  return allLights
}

export async function changeLight(light, state) {
  const lightChange = await client.lights.getById(light).then((l) => {
    const newLight = merge(l, JSON.parse(state))
    return client.lights.save(newLight)
  })

  return lightChange
}
