import test from 'ava';
import { Neutrino } from 'neutrino';

const mw = () => require('..');

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  const api = Neutrino();

  t.notThrows(() => api.use(mw()));
});

test('instantiates', t => {
  const api = Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});
