import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';
import neutrino from '../../neutrino';

const mw = () => require('..');
const options = { eslint: { rules: { semi: false } } };

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  t.notThrows(() => new Neutrino().use(mw()));
});

test('uses with options', t => {
  t.notThrows(() => new Neutrino().use(mw(), options));
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

test('supports formatter being the name of an ESLint built-in formatter', t => {
  const api = new Neutrino();
  const formatter = 'compact';
  const formatterPath = require.resolve(`eslint/lib/formatters/${formatter}`);
  api.use(mw(), { eslint: { formatter } });

  const loaderOptions = api.config.module.rule('lint').use('eslint').get('options');
  t.is(loaderOptions.formatter, formatterPath);
});

test('supports formatter being a resolved path', t => {
  const api = new Neutrino();
  const formatter = require.resolve('eslint/lib/formatters/compact');
  api.use(mw(), { eslint: { formatter } });

  const loaderOptions = api.config.module.rule('lint').use('eslint').get('options');
  t.is(loaderOptions.formatter, formatter);
});

test('exposes eslintrc output handler', t => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('eslintrc');

  t.is(typeof handler, 'function');
});

test('exposes eslintrc config from output', t => {
  const config = neutrino(mw()).output('eslintrc');

  t.is(typeof config, 'object');
});

test('exposes eslintrc method', t => {
  t.is(typeof neutrino(mw()).eslintrc, 'function');
});

test('exposes eslintrc config from method', t => {
  t.is(typeof neutrino(mw()).eslintrc(), 'object');
});

test('throws when used after a compile preset', t => {
  const api = new Neutrino();
  api.use(require('../../web'));

  t.throws(() => api.use(mw()), /Lint presets must be defined prior/);
});
