const { Neutrino } = require('neutrino');

module.exports = Neutrino()
  .use('.neutrinorc.js')
  .call('eslintrc');
