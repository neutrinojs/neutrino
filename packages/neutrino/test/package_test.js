const neutrino = require('..');

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  // Restore the original NODE_ENV after each test (which Jest defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('default mode derived from production NODE_ENV', () => {
  process.env.NODE_ENV = 'production';
  const webpackConfig = neutrino().output('webpack');
  expect(webpackConfig.mode).toBe('production');
});

test('default mode derived from development NODE_ENV', () => {
  process.env.NODE_ENV = 'development';
  const webpackConfig = neutrino().output('webpack');
  expect(webpackConfig.mode).toBe('development');
});

test('default mode derived from test NODE_ENV', () => {
  process.env.NODE_ENV = 'test';
  const webpackConfig = neutrino().output('webpack');
  expect(webpackConfig.mode).toBe('development');
});

test('undefined mode and NODE_ENV sets only NODE_ENV', () => {
  delete process.env.NODE_ENV;
  const webpackConfig = neutrino().output('webpack');
  expect(process.env.NODE_ENV).toBe('production');
  expect('mode' in webpackConfig).toBe(false);
});

test('throws when vendor entrypoint defined', () => {
  const mw = (neutrino) => neutrino.config.entry('vendor').add('lodash');
  expect(() => neutrino(mw).output('webpack')).toThrow(
    /Remove the manual `vendor` entrypoint/,
  );
});

test('throws when trying to use a non-registered output', () => {
  expect(() => neutrino(Function.prototype).output('fake')).toThrow(
    'Unable to find an output handler named "fake"',
  );
});

test('throws when trying to use a non-registered proxied method', () => {
  expect(() => neutrino(Function.prototype).fake()).toThrow(
    'Unable to find an output handler named "fake"',
  );
});

test('throws when trying to specify "env"', () => {
  expect(() => neutrino({ env: {} })).toThrow(
    /Specifying "env" in middleware has been removed/,
  );
});

test('exposes webpack output handler', () => {
  expect(() => neutrino(Function.prototype).output('webpack')).not.toThrow();
});

test('exposes webpack config from output', () => {
  const handler = neutrino(Function.prototype).output('webpack');
  expect(typeof handler).toBe('object');
});

test('exposes webpack method', () => {
  expect(typeof neutrino(Function.prototype).webpack).toBe('function');
});

test('exposes webpack config from method', () => {
  const handler = neutrino(Function.prototype).webpack();
  expect(typeof handler).toBe('object');
});

test('exposes inspect output handler', () => {
  expect(() => {
    // Overriding console.log to prevent the inspect() method from logging to
    // the console during tests, interfering with the ava output.
    const original = console.log;

    console.log = Function.prototype;
    neutrino(Function.prototype).output('inspect');
    console.log = original.bind(console);
  }).not.toThrow();
});
