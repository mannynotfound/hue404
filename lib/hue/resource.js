import {Router} from 'express'
import wrap from 'express-async-wrap'
import {getAllLights, changeLight} from './'

const router = new Router()

router.get('/allLights', wrap(async({}, res, next) => {
  res.json(await getAllLights())
}))

router.get('/changeLight/:light/:state', wrap(async({params: {light, state}}, res, next) => {
  res.json(await changeLight(light, state))
}))

export default router

