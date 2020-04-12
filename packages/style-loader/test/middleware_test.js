const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const options = { css: { modules: true }, style: { sourceMap: true } };
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  // Restore the original NODE_ENV after each test (which Jest defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads middleware', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses middleware', () => {
  expect(() => new Neutrino().use(mw())).not.toThrow();
});

test('uses with options', () => {
  expect(() => new Neutrino().use(mw(options))).not.toThrow();
});

test('instantiates', () => {
  const api = new Neutrino();

  api.use(mw());

  expect(() => api.config.toConfig()).not.toThrow();
});

test('instantiates with options', () => {
  const api = new Neutrino();

  api.use(mw(options));

  expect(() => api.config.toConfig()).not.toThrow();
});

test('uses CSS modules by default', () => {
  const api = new Neutrino();

  api.use(mw());

  expect(api.config.module.rule('style').oneOfs.has('modules')).toBe(true);

  const options = api.config.module
    .rule('style')
    .oneOf('modules')
    .use('css')
    .get('options');

  expect(options && options.modules).toBeTruthy();
});

test('respects disabling of CSS modules', () => {
  const api = new Neutrino();

  api.use(mw({ modules: false }));

  expect(api.config.module.rule('style').oneOfs.has('modules')).toBe(false);

  const style = api.config.module.rule('style').toConfig();

  style.oneOf.forEach((oneOf) => {
    oneOf.use.forEach((use) => {
      expect(
        use.options && use.options.css && use.options.css.modules,
      ).toBeFalsy();
    });
  });
});

test('does not extract in development by default', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();

  api.use(mw());

  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('style'),
  ).toBe(true);
  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('extract'),
  ).toBe(false);
});

test('extracts in production by default', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw());

  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('style'),
  ).toBe(false);
  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('extract'),
  ).toBe(true);
});

test('respects enabling of extract in development using extract.enabled', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();

  api.use(mw({ extract: { enabled: true } }));

  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('style'),
  ).toBe(false);
  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('extract'),
  ).toBe(true);
});

test('respects disabling of extract in production using false', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw({ extract: false }));

  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('style'),
  ).toBe(true);
  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('extract'),
  ).toBe(false);
});

test('respects disabling of extract in production using extract.enabled', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw({ extract: { enabled: false } }));

  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('style'),
  ).toBe(true);
  expect(
    api.config.module.rule('style').oneOf('normal').uses.has('extract'),
  ).toBe(false);
});

test('throws when used twice', () => {
  const api = new Neutrino();
  api.use(mw());
  expect(() => api.use(mw())).toThrow(
    /@neutrinojs\/style-loader has been used twice with the same ruleId of 'style'/,
  );
});
