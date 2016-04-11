import {Router} from 'express'
import wrap from 'express-async-wrap'
import {getWhiteList, getStream} from './'

const router = new Router()

router.get('/getWhitelist', wrap(async({}, res, next) => {
  res.json(await getWhiteList())
}))

router.get('/getStream', wrap(async({}, res, next) => {
  res.json(await getStream())
}))

export default router
