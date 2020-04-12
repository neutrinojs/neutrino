const { validate } = require('webpack');
const lint = require('../../eslint');
const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const originalNodeEnv = process.env.NODE_ENV;
const expectedExtensions = ['.wasm', '.mjs', '.jsx', '.vue', '.js', '.json'];

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
  const config = api.config.toConfig();

  const errors = validate(config);
  expect(config.resolve.extensions).toEqual(expectedExtensions);

  expect(errors).toHaveLength(0);
});

test('valid preset development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  const errors = validate(config);
  expect(config.resolve.extensions).toEqual(expectedExtensions);

  expect(errors).toHaveLength(0);
});

test('updates lint config by default', () => {
  const api = new Neutrino();
  api.use(lint());
  api.use(mw());

  const lintRule = api.config.module.rule('lint');
  expect(lintRule.get('test')).toEqual(/\.(mjs|jsx|vue|js)$/);
  expect(lintRule.use('eslint').get('options').baseConfig).toEqual({
    env: {
      browser: true,
      commonjs: true,
      es6: true,
    },
    extends: ['plugin:vue/base'],
    globals: {
      process: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
      ecmaVersion: 2018,
      parser: 'babel-eslint',
      sourceType: 'module',
    },
    plugins: ['babel', 'vue'],
    root: true,
  });
});

test('does not update lint config if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(lint({ eslint: { useEslintrc: true } }));
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig).toEqual({});
});

test('adds style oneOfs in order', () => {
  const api = new Neutrino();
  api.use(mw());
  const { oneOfs } = api.config.module.rule('style');
  expect(oneOfs.values().map((oneOf) => oneOf.name)).toEqual([
    'vue-modules',
    'vue-normal',
    'modules',
    'normal',
  ]);
});

test('replaces style-loader with vue-style-loader in development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());

  api.config.module
    .rule('style')
    .oneOfs.values()
    .filter((oneOf) => oneOf.name.startsWith('vue-'))
    .forEach((oneOf) => {
      expect(oneOf.use('style').get('loader')).toBe(
        require.resolve('vue-style-loader'),
      );
    });
});
