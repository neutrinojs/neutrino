const { Neutrino } = require('neutrino');

module.exports = Neutrino({ root: __dirname })
  .use('.neutrinorc.js')
  .call('eslintrc');
