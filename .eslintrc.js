const { Neutrino } = require('./packages/neutrino');

const api = Neutrino();

module.exports = api.call('eslintrc');
