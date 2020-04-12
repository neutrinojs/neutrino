const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const options = { name: 'alpha.beta' };

test('loads middleware', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses middleware', () => {
  expect(() => new Neutrino().use(mw())).not.toThrow();
});

test('uses with options', () => {
  expect(() => new Neutrino().use(mw(options))).not.toThrow();
});

test('instantiates', () => {
  const api = new Neutrino();

  api.use(mw());

  expect(() => api.config.toConfig()).not.toThrow();
});

test('instantiates with options', () => {
  const api = new Neutrino();

  api.use(mw(options));

  expect(() => api.config.toConfig()).not.toThrow();
});
