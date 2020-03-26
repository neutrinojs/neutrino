import test from 'ava';
import lint from '../../eslint';
import Neutrino from '../../neutrino/Neutrino';
import neutrino from '../../neutrino';

const mw = (...args) => require('..')(...args);
const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads middleware', (t) => {
  t.notThrows(() => require('..'));
});

test('uses middleware', (t) => {
  t.notThrows(() => {
    const api = new Neutrino();
    api.use(mw());
  });
});

test('instantiates', (t) => {
  const api = new Neutrino();
  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates in development', (t) => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates in production', (t) => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('exposes karma output handler', (t) => {
  const api = new Neutrino();
  api.use(mw());

  const handler = api.outputHandlers.get('karma');

  t.is(typeof handler, 'function');
});

test('exposes karma config from output', (t) => {
  // Karma's config handler returns a function.
  // Force evaluation by calling it.
  const fakeKarma = new Map();
  const config = neutrino(mw()).output('karma')(fakeKarma);

  t.is(config, fakeKarma);
});

test('exposes karma method', (t) => {
  t.is(typeof neutrino(mw()).karma, 'function');
});

test('exposes karma config from method', (t) => {
  // Karma's config handler returns a function.
  // Force evaluation by calling it.
  const fakeKarma = new Map();
  const config = neutrino(mw()).karma()(fakeKarma);

  t.is(config, fakeKarma);
});

test('uses middleware with options', (t) => {
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

  t.is(options.webpackMiddleware.stats.errors, false);
});

test('updates lint config by default', (t) => {
  const api = new Neutrino();
  api.use(lint());
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  t.deepEqual(options.baseConfig.env, {
    es6: true,
    mocha: true,
  });
});

test('does not update lint config if useEslintrc true', (t) => {
  const api = new Neutrino();
  api.use(lint({ eslint: { useEslintrc: true } }));
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  t.deepEqual(options.baseConfig, {});
});
