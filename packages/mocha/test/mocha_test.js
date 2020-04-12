const lint = require('../../eslint');
const Neutrino = require('../../neutrino/Neutrino');
const neutrino = require('../../neutrino');

const mw = (...args) => require('..')(...args);
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  // Restore the original NODE_ENV after each test (which Jest defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads middleware', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses middleware', () => {
  expect(() => {
    const api = new Neutrino();
    api.use(mw());
  }).not.toThrow();
});

test('instantiates', () => {
  const api = new Neutrino();
  api.use(mw());

  expect(() => api.config.toConfig()).not.toThrow();
});

test('instantiates in development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());

  expect(() => api.config.toConfig()).not.toThrow();
});

test('instantiates in production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw());

  expect(() => api.config.toConfig()).not.toThrow();
});

test('exposes mocha output handler', () => {
  const api = new Neutrino();
  api.use(mw());

  const handler = api.outputHandlers.get('mocha');

  expect(typeof handler).toBe('function');
});

test('exposes mocha method', () => {
  expect(typeof neutrino(mw()).mocha).toBe('function');
});

test('updates lint config by default', () => {
  const api = new Neutrino();
  api.use(lint());
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig.env).toEqual({
    es6: true,
    mocha: true,
  });
});

test('does not update lint config if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(lint({ eslint: { useEslintrc: true } }));
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig).toEqual({});
});
