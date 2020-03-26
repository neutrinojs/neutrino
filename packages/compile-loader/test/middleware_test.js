import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';
import neutrino from '../../neutrino';

const mw = (...args) => require('..')(...args);
const options = { test: /\.js$/, babel: { cacheDirectory: false } };

test('loads middleware', (t) => {
  t.notThrows(() => require('..'));
});

test('uses middleware', (t) => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw()));
});

test('uses with options', (t) => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw(options)));
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

test('exposes babel output handler', (t) => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('babel');

  t.is(typeof handler, 'function');
});

test('exposes babel config from output', (t) => {
  const config = neutrino(mw()).output('babel');

  t.is(typeof config, 'object');
});

test('exposes babel method', (t) => {
  t.is(typeof neutrino(mw()).babel, 'function');
});

test('exposes babel config from method', (t) => {
  t.is(typeof neutrino(mw()).babel(), 'object');
});

test('throws when used twice', (t) => {
  const api = new Neutrino();
  api.use(mw());
  t.throws(
    () => api.use(mw()),
    /@neutrinojs\/compile-loader has been used twice with the same ruleId of 'compile'/,
  );
});
