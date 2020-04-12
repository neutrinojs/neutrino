const { validate } = require('webpack');
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
  const api = new Neutrino({ root: __dirname });

  expect(() => api.use(mw({ name: 'alpha' }))).not.toThrow();
});

test('valid preset production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino({ root: __dirname });

  api.use(mw());
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('web');
  expect(config.optimization.runtimeChunk).toBe(false);
  expect(config.optimization.splitChunks).toBe(false);

  // NODE_ENV/command specific
  expect(config.optimization.minimize).toBe(true);
  expect(config.devtool).toBe('source-map');
  expect(config.devServer).toBeUndefined();

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('valid preset development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino({ root: __dirname });

  api.use(mw());
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('web');
  expect(config.optimization.runtimeChunk).toBe('single');
  expect(config.optimization.splitChunks.chunks).toBe('all');

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});
