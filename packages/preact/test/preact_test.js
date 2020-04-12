const { validate } = require('webpack');
const lint = require('../../eslint');
const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  // Restore the original NODE_ENV after each test (which Jest defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads preset', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses preset', () => {
  expect(() => new Neutrino().use(mw())).not.toThrow();
});

test('valid preset production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw());

  const errors = validate(api.config.toConfig());

  expect(errors).toHaveLength(0);
});

test('valid preset development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());

  const errors = validate(api.config.toConfig());

  expect(errors).toHaveLength(0);
});

test('updates lint config by default', () => {
  const api = new Neutrino();
  api.use(lint());
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig.env).toEqual({
    browser: true,
    commonjs: true,
    es6: true,
  });
  expect(options.baseConfig.plugins).toEqual(['babel', 'react']);
  expect(options.baseConfig.settings).toEqual({ react: { pragma: 'h' } });
});

test('does not update lint config if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(lint({ eslint: { useEslintrc: true } }));
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig).toEqual({});
});
