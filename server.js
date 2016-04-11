require('dotenv-safe').load({
  silent: true,
  allowEmptyValues: true
})
require('babel-register')
require('./lib/app')
