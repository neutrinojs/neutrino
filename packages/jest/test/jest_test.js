const airbnbPreset = require('../../airbnb');
const eslintPreset = require('../../eslint');
const reactPreset = require('../../react');
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
  const api = new Neutrino();

  expect(() => {
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

test('exposes jest output handler', () => {
  const api = new Neutrino();
  api.use(mw());

  const handler = api.outputHandlers.get('jest');

  expect(typeof handler).toBe('function');
});

test('exposes jest config from output', () => {
  const config = neutrino(mw()).output('jest');

  expect(typeof config).toBe('object');
});

test('exposes jest method', () => {
  expect(typeof neutrino(mw()).jest).toBe('function');
});

test('exposes jest config from method', () => {
  expect(typeof neutrino(mw()).jest()).toBe('object');
});

test('uses middleware with options', () => {
  const config = neutrino(mw({ testEnvironment: 'node' })).jest();

  expect(config.testEnvironment).toBe('node');
});

test('updates lint config by default', () => {
  const api = new Neutrino();
  api.use(airbnbPreset());
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig.extends).toEqual([
    require.resolve('eslint-config-airbnb'),
    require.resolve('eslint-config-airbnb/hooks'),
    'plugin:jest/recommended',
  ]);
});

test('does not update lint config if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(eslintPreset({ eslint: { useEslintrc: true } }));
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig).toEqual({});
});

test('configures moduleFileExtensions correctly', () => {
  const api = new Neutrino();
  api.use(reactPreset());
  api.use(mw());
  const config = api.outputHandlers.get('jest')(api);
  expect(config.moduleFileExtensions).toEqual([
    'web.jsx',
    'web.js',
    'wasm',
    'jsx',
    'js',
    'json',
  ]);
});
