const { Neutrino } = require('../neutrino');

module.exports = Neutrino({ root: __dirname })
  .use(require('.')) // eslint-disable-line global-require
  .call('eslintrc');
