require('dotenv-safe').load({
  silent: true,
  allowEmptyValues: true
})
require('babel-register')
require('./lib/app')

/*
 * SEND SERVER ERRORS TO TXT MESSAGE VIA TWILIO
 */
var twilio = require('./lib/twilio')
var config = require('./lib/core/config')

process.stdin.resume()

function exitHandler(options, err) {
  var text = ''
  if (err) {
    text = 'THERE WAS AN ERROR ' + JSON.stringify(err.stack).substring(0, 140)
  }
  if (options.exit) {
    text += ' EXITING  ....'
  }

  twilio.sendSms(config.get('ADMIN_NUMBER'), text, function(err, resp) {
    if (err) {
      console.log('COULD NOT CONTRACT ADMINISTRATOR')
    } else {
      console.log('SENT TEXT TO ADMINISTRATOR')
    }

    if (options.exit) process.exit()
  })
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
