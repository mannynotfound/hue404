import {Router} from 'express'
import wrap from 'express-async-wrap'
import {getWhiteList, getStream} from './'
import Emitter from '../core/emitter'

const router = new Router()

router.get('/getWhitelist', wrap(async({}, res, next) => {
  res.json(await getWhiteList())
}))

router.get('/getStream', wrap(async({}, res, next) => {
  res.json(await getStream())
}))

router.post('/startStream', (req, res) => {
  Emitter.emit('start')
  res.sendStatus(200).end()
})

router.post('/stopStream', (req, res) => {
  Emitter.emit('stop')
  res.sendStatus(200).end()
})

export default router
