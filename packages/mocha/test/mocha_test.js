import test from 'ava';
import { Neutrino } from 'neutrino';

const mw = () => require('..');

test('loads preset', t => {
  t.notThrows(mw);
});

test('uses preset', t => {
  const api = Neutrino();

  t.notThrows(() => api.use(mw()));
});

test('uses preset in test environment', t => {
  const api = Neutrino({ env: { NODE_ENV: 'test' } });

  t.notThrows(() => api.use(mw()));
});

test('instantiates in test environment', t => {
  const api = Neutrino({ env: { NODE_ENV: 'test' } });

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});
