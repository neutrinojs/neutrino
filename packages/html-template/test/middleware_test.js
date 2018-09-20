import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const options = { title: 'Alpha Beta', appMountId: 'app' };
const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw()));
});

test('uses with options', t => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw(), options));
});

test('instantiates', t => {
  const api = new Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', t => {
  const api = new Neutrino();

  api.use(mw(), options);

  t.notThrows(() => api.config.toConfig());
});

test('minifies in production', t => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw());

  const pluginOptions = api.config.plugin('html').get('args')[0];
  t.deepEqual(pluginOptions.minify, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  });
});

test('does not minify in development', t => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());

  const pluginOptions = api.config.plugin('html').get('args')[0];
  t.false(pluginOptions.minify);
});
