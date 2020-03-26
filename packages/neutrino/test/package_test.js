import test from 'ava';
import neutrino from '..';

const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('default mode derived from production NODE_ENV', (t) => {
  process.env.NODE_ENV = 'production';
  const webpackConfig = neutrino().output('webpack');
  t.is(webpackConfig.mode, 'production');
});

test('default mode derived from development NODE_ENV', (t) => {
  process.env.NODE_ENV = 'development';
  const webpackConfig = neutrino().output('webpack');
  t.is(webpackConfig.mode, 'development');
});

test('default mode derived from test NODE_ENV', (t) => {
  process.env.NODE_ENV = 'test';
  const webpackConfig = neutrino().output('webpack');
  t.is(webpackConfig.mode, 'development');
});

test('undefined mode and NODE_ENV sets only NODE_ENV', (t) => {
  delete process.env.NODE_ENV;
  const webpackConfig = neutrino().output('webpack');
  t.is(process.env.NODE_ENV, 'production');
  t.false('mode' in webpackConfig);
});

test('throws when vendor entrypoint defined', (t) => {
  const mw = (neutrino) => neutrino.config.entry('vendor').add('lodash');
  t.throws(
    () => neutrino(mw).output('webpack'),
    /Remove the manual `vendor` entrypoint/,
  );
});

test('throws when trying to use a non-registered output', (t) => {
  t.throws(
    () => neutrino(Function.prototype).output('fake'),
    'Unable to find an output handler named "fake"',
  );
});

test('throws when trying to use a non-registered proxied method', (t) => {
  t.throws(
    () => neutrino(Function.prototype).fake(),
    'Unable to find an output handler named "fake"',
  );
});

test('throws when trying to specify "env"', (t) => {
  t.throws(
    () => neutrino({ env: {} }),
    /Specifying "env" in middleware has been removed/,
  );
});

test('exposes webpack output handler', (t) => {
  t.notThrows(() => neutrino(Function.prototype).output('webpack'));
});

test('exposes webpack config from output', (t) => {
  const handler = neutrino(Function.prototype).output('webpack');
  t.is(typeof handler, 'object');
});

test('exposes webpack method', (t) => {
  t.is(typeof neutrino(Function.prototype).webpack, 'function');
});

test('exposes webpack config from method', (t) => {
  const handler = neutrino(Function.prototype).webpack();
  t.is(typeof handler, 'object');
});

test('exposes inspect output handler', (t) => {
  t.notThrows(() => {
    // Overriding console.log to prevent the inspect() method from logging to
    // the console during tests, interfering with the ava output.
    const original = console.log;

    console.log = Function.prototype;
    neutrino(Function.prototype).output('inspect');
    console.log = original.bind(console);
  });
});
