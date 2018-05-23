import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const options = { name: '[name].[ext]' };

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
