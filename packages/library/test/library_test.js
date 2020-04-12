const { validate } = require('webpack');
const lint = require('../../eslint');
const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const expectedExtensions = ['.wasm', '.mjs', '.jsx', '.js', '.json'];
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  // Restore the original NODE_ENV after each test (which Jest defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads preset', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses preset', () => {
  const api = new Neutrino();

  expect(() => api.use(mw({ name: 'alpha' }))).not.toThrow();
});

test('throws when missing library name', () => {
  const api = new Neutrino();

  expect(() => api.use(mw())).toThrow(/You must specify a library name/);
});

test('throws when polyfills defined', () => {
  const api = new Neutrino();

  expect(() => api.use(mw({ name: 'alpha', polyfills: {} }))).toThrow(
    /The polyfills option has been removed/,
  );
});

test('valid preset production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw({ name: 'alpha' }));
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('web');
  expect(config.resolve.extensions).toEqual(expectedExtensions);
  expect(config.optimization).toBeUndefined();
  expect(config.devServer).toBeUndefined();
  expect(config.stats).toEqual({
    children: false,
    entrypoints: false,
    modules: false,
  });

  // NODE_ENV/command specific
  expect(config.devtool).toBe('source-map');
  expect(config.externals).not.toBeUndefined();

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('valid preset development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();

  api.use(mw({ name: 'alpha' }));
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('web');
  expect(config.resolve.extensions).toEqual(expectedExtensions);
  expect(config.optimization).toBeUndefined();
  expect(config.devServer).toBeUndefined();
  expect(config.stats).toEqual({
    children: false,
    entrypoints: false,
    modules: false,
  });

  // NODE_ENV/command specific
  expect(config.devtool).toBe('source-map');
  expect(config.externals).not.toBeUndefined();

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('removes webpack externals when NODE_ENV=test', () => {
  process.env.NODE_ENV = 'test';

  const api = new Neutrino();

  api.use(mw({ name: 'alpha' }));

  const config = api.config.toConfig();

  expect(config.externals).toBeUndefined();
});

test('valid preset Node.js target', () => {
  const api = new Neutrino();
  api.use(mw({ name: 'alpha', target: 'node' }));

  const errors = validate(api.config.toConfig());

  expect(errors).toHaveLength(0);
});

test('valid preset commonjs2 libraryTarget', () => {
  const api = new Neutrino();
  api.use(mw({ name: 'alpha', libraryTarget: 'commonjs2' }));

  const errors = validate(api.config.toConfig());

  expect(errors).toHaveLength(0);
});

test('targets option test', () => {
  const api = new Neutrino();
  const targets = {
    browsers: ['last 2 iOS versions'],
  };

  api.use(mw({ name: 'alpha', targets }));

  expect(
    api.config.module.rule('compile').use('babel').get('options').presets[0][1]
      .targets,
  ).toEqual(targets);
});

test('targets false option test', () => {
  const api = new Neutrino();
  api.use(mw({ name: 'alpha', targets: false }));

  expect(
    api.config.module.rule('compile').use('babel').get('options').presets[0][1]
      .targets,
  ).toEqual({});
});

test('updates lint config by default when target is web', () => {
  const api = new Neutrino();
  api.use(lint());
  api.use(mw({ name: 'alpha', target: 'web' }));
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig.env).toEqual({
    browser: true,
    commonjs: true,
    es6: true,
  });
});

test('updates lint config by default when target is node', () => {
  const api = new Neutrino();
  api.use(lint());
  api.use(mw({ name: 'alpha', target: 'node' }));
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig.env).toEqual({
    commonjs: true,
    es6: true,
  });
});

test('does not update lint config if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(lint({ eslint: { useEslintrc: true } }));
  api.use(mw({ name: 'alpha' }));
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig).toEqual({});
});
