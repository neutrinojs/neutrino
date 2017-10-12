const { Neutrino } = require('../neutrino');

const api = Neutrino({ cwd: __dirname });

// eslint-disable-next-line global-require
module.exports = api.call('eslintrc', [require('.')]);
