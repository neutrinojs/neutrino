import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = (...args) => require('..')(...args);
const options = { css: { modules: true }, style: { sourceMap: true } };
const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads middleware', (t) => {
  t.notThrows(() => require('..'));
});

test('uses middleware', (t) => {
  t.notThrows(() => new Neutrino().use(mw()));
});

test('uses with options', (t) => {
  t.notThrows(() => new Neutrino().use(mw(options)));
});

test('instantiates', (t) => {
  const api = new Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', (t) => {
  const api = new Neutrino();

  api.use(mw(options));

  t.notThrows(() => api.config.toConfig());
});

test('uses CSS modules by default', (t) => {
  const api = new Neutrino();

  api.use(mw());

  t.true(api.config.module.rule('style').oneOfs.has('modules'));

  const options = api.config.module
    .rule('style')
    .oneOf('modules')
    .use('css')
    .get('options');

  t.truthy(options && options.modules);
});

test('respects disabling of CSS modules', (t) => {
  const api = new Neutrino();

  api.use(mw({ modules: false }));

  t.false(api.config.module.rule('style').oneOfs.has('modules'));

  const style = api.config.module.rule('style').toConfig();

  style.oneOf.forEach((oneOf) => {
    oneOf.use.forEach((use) => {
      t.falsy(use.options && use.options.css && use.options.css.modules);
    });
  });
});

test('does not extract in development by default', (t) => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();

  api.use(mw());

  t.true(api.config.module.rule('style').oneOf('normal').uses.has('style'));
  t.false(api.config.module.rule('style').oneOf('normal').uses.has('extract'));
});

test('extracts in production by default', (t) => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw());

  t.false(api.config.module.rule('style').oneOf('normal').uses.has('style'));
  t.true(api.config.module.rule('style').oneOf('normal').uses.has('extract'));
});

test('respects enabling of extract in development using extract.enabled', (t) => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();

  api.use(mw({ extract: { enabled: true } }));

  t.false(api.config.module.rule('style').oneOf('normal').uses.has('style'));
  t.true(api.config.module.rule('style').oneOf('normal').uses.has('extract'));
});

test('respects disabling of extract in production using false', (t) => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw({ extract: false }));

  t.true(api.config.module.rule('style').oneOf('normal').uses.has('style'));
  t.false(api.config.module.rule('style').oneOf('normal').uses.has('extract'));
});

test('respects disabling of extract in production using extract.enabled', (t) => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw({ extract: { enabled: false } }));

  t.true(api.config.module.rule('style').oneOf('normal').uses.has('style'));
  t.false(api.config.module.rule('style').oneOf('normal').uses.has('extract'));
});

test('throws when used twice', (t) => {
  const api = new Neutrino();
  api.use(mw());
  t.throws(
    () => api.use(mw()),
    /@neutrinojs\/style-loader has been used twice with the same ruleId of 'style'/,
  );
});
