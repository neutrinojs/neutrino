import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';
import neutrino from '../../neutrino';

const mw = () => require('..');

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  t.notThrows(() => {
    const api = new Neutrino();

    api.config.mode('production');
    api.use(mw());
  });
});

test('instantiates', t => {
  const api = new Neutrino();

  api.config.mode('production');
  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates in development', t => {
  const api = new Neutrino();

  api.config.mode('development');
  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('exposes mocha output handler', t => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('mocha');

  t.is(typeof handler, 'function');
});

test('exposes mocha method', t => {
  t.is(typeof neutrino(mw()).mocha, 'function');
});
