import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const options = { title: 'Alpha Beta', appMountId: 'app' };

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw()));
});

test('uses with options', t => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw(), options));
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
