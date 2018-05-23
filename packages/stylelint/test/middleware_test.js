import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';
import neutrino from '../../neutrino';

const mw = () => require('..');
const options = { stylelint: { rules: { 'rule-empty-line-before': true } } };

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

test('exposes stylelintrc output handler', t => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('stylelintrc');

  t.is(typeof handler, 'function');
});

test('exposes stylelintrc config from output', t => {
  const config = neutrino(mw()).output('stylelintrc');

  t.is(typeof config, 'object');
});

test('exposes stylelintrc method', t => {
  t.is(typeof neutrino(mw()).stylelintrc, 'function');
});

test('exposes stylelintrc config from method', t => {
  t.is(typeof neutrino(mw()).stylelintrc(), 'object');
});
