import test from 'ava';
import { Neutrino } from 'neutrino';

const mw = () => require('..');
const options = { css: { modules: true }, style: { sourceMap: true } };

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  t.notThrows(() => Neutrino().use(mw()));
});

test('uses with options', t => {
  t.notThrows(() => Neutrino().use(mw(), options));
});

test('instantiates', t => {
  const api = Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', t => {
  const api = Neutrino();

  api.use(mw(), options);

  t.notThrows(() => api.config.toConfig());
});
