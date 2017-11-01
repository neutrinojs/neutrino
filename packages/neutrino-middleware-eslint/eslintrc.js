const { Neutrino } = require('../neutrino');

// eslint-disable-next-line global-require
module.exports = Neutrino({ cwd: __dirname }).call('eslintrc', [require('.')]);
