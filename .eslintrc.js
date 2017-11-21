const { Neutrino } = require('./packages/neutrino');

module.exports = Neutrino()
  .use('.neutrinorc.js')
  .call('eslintrc');
