const { Neutrino } = require('neutrino');

const api = Neutrino();

module.exports = api.call('eslintrc');
