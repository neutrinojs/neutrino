const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const options = { name: 'app.js' };

test('loads middleware', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses middleware', () => {
  expect(() => new Neutrino().use(mw())).not.toThrow();
});

test('uses with options', () => {
  expect(() => new Neutrino().use(mw(options))).not.toThrow();
});

test('uses middleware while debugging', () => {
  const api = new Neutrino({ debug: true });

  expect(() => api.use(mw())).not.toThrow();
});

test('uses with options while debugging', () => {
  const api = new Neutrino({ debug: true });

  expect(() => api.use(mw(options))).not.toThrow();
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
