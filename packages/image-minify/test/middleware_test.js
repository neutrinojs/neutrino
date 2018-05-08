import test from 'ava';
import { Neutrino } from 'neutrino';

const mw = () => require('..');
const prodEnv = { env: { NODE_ENV: 'production' } };
const devEnv = { env: { NODE_ENV: 'development' } };
const options = { rules: ['image'] };

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  t.notThrows(() => Neutrino(prodEnv).use(mw()));
});

test('uses with options', t => {
  t.notThrows(() => Neutrino(prodEnv).use(mw(), options));
});

test('instantiates', t => {
  const api = Neutrino(prodEnv);
  api.use(mw());

  t.true(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', t => {
  const api = Neutrino(prodEnv);
  api.use(mw(), options);

  t.true(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});

test('disabled in development', t => {
  const api = Neutrino(devEnv);
  api.use(mw(), options);

  t.false(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});
