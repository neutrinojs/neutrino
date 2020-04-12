const Neutrino = require('../../neutrino/Neutrino');
const neutrino = require('../../neutrino');

const mw = (...args) => require('..')(...args);
const options = { test: /\.js$/, babel: { cacheDirectory: false } };

test('loads middleware', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses middleware', () => {
  const api = new Neutrino();

  expect(() => api.use(mw())).not.toThrow();
});

test('uses with options', () => {
  const api = new Neutrino();

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

test('exposes babel output handler', () => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('babel');

  expect(typeof handler).toBe('function');
});

test('exposes babel config from output', () => {
  const config = neutrino(mw()).output('babel');

  expect(typeof config).toBe('object');
});

test('exposes babel method', () => {
  expect(typeof neutrino(mw()).babel).toBe('function');
});

test('exposes babel config from method', () => {
  expect(typeof neutrino(mw()).babel()).toBe('object');
});

test('throws when used twice', () => {
  const api = new Neutrino();
  api.use(mw());
  expect(() => api.use(mw())).toThrow(
    /@neutrinojs\/compile-loader has been used twice with the same ruleId of 'compile'/,
  );
});
