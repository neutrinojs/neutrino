import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw()));
});

test('instantiates', t => {
  const api = new Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});
