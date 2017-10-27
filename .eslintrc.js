const { Neutrino } = require('./packages/neutrino');

module.exports = Neutrino()
  .use('.neutrinorc.js') // eslint-disable-line global-require
  .call('eslintrc');
