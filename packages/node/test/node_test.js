const { validate } = require('webpack');
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

  expect(() => api.use(mw())).not.toThrow();
});

test('uses preset with custom main', () => {
  const api = new Neutrino({ mains: { server: 'server' } });

  expect(() => api.use(mw())).not.toThrow();
  expect(api.config.entryPoints.has('server')).toBe(true);
});

test('valid preset production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('node');
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

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('valid preset development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());

  // Turn off listening to keyboard events to prevent the test leaking.
  api.config.plugin('start-server').tap(([options]) => [
    {
      ...options,
      keyboard: false,
    },
  ]);

  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('node');
  expect(config.resolve.extensions).toEqual(expectedExtensions);
  expect(config.optimization).toBeUndefined();
  expect(config.devServer).toBeUndefined();
  expect(config.stats).toEqual({
    children: false,
    entrypoints: false,
    modules: false,
  });

  // NODE_ENV/command specific
  expect(config.devtool).toBe('inline-sourcemap');

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('throws when polyfills defined', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ polyfills: {} }))).toThrow(
    /The polyfills option has been removed/,
  );
});
