const { Neutrino } = require('../neutrino');

module.exports = Neutrino({ cwd: __dirname })
  .use(require('.')) // eslint-disable-line global-require
  .call('eslintrc');
