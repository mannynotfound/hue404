import EventEmitter from 'events'

class Emitter extends EventEmitter {}

const appEmitter = new Emitter()
export default appEmitter
