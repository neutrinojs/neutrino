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

test('exposes karma output handler', t => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('karma');

  t.is(typeof handler, 'function');
});

test('exposes karma config from output', t => {
  // Karma's config handler returns a function.
  // Force evaluation by calling it.
  const fakeKarma = new Map();
  const config = neutrino(mw()).output('karma')(fakeKarma);

  t.is(config, fakeKarma);
});

test('exposes karma method', t => {
  t.is(typeof neutrino(mw()).karma, 'function');
});

test('exposes karma config from method', t => {
  // Karma's config handler returns a function.
  // Force evaluation by calling it.
  const fakeKarma = new Map();
  const config = neutrino(mw()).karma()(fakeKarma);

  t.is(config, fakeKarma);
});
