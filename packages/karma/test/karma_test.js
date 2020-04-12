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

test('exposes karma output handler', () => {
  const api = new Neutrino();
  api.use(mw());

  const handler = api.outputHandlers.get('karma');

  expect(typeof handler).toBe('function');
});

test('exposes karma config from output', () => {
  // Karma's config handler returns a function.
  // Force evaluation by calling it.
  const fakeKarma = new Map();
  const config = neutrino(mw()).output('karma')(fakeKarma);

  expect(config).toBe(fakeKarma);
});

test('exposes karma method', () => {
  expect(typeof neutrino(mw()).karma).toBe('function');
});

test('exposes karma config from method', () => {
  // Karma's config handler returns a function.
  // Force evaluation by calling it.
  const fakeKarma = new Map();
  const config = neutrino(mw()).karma()(fakeKarma);

  expect(config).toBe(fakeKarma);
});

test('uses middleware with options', () => {
  // Karma's config handler returns a function.
  // Force evaluation by calling it.
  const fakeKarma = new Map();
  const config = neutrino(
    mw({
      webpackMiddleware: {
        stats: {
          errors: false,
        },
      },
    }),
  ).karma()(fakeKarma);

  // Since we are faking out the Karma API with a Map, we need to get the
  // object back out of the map and check that the merge happened correctly.
  const [options] = [...config][0];

  expect(options.webpackMiddleware.stats.errors).toBe(false);
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
