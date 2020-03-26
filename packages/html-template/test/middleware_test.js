import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = (...args) => require('..')(...args);
const options = { title: 'Alpha Beta', appMountId: 'app' };

test('loads middleware', (t) => {
  t.notThrows(() => require('..'));
});

test('uses middleware', (t) => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw()));
});

test('uses with options', (t) => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw(options)));
});

test('instantiates', (t) => {
  const api = new Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', (t) => {
  const api = new Neutrino();

  api.use(mw(options));

  t.notThrows(() => api.config.toConfig());
});

test('throws when links defined with default template', (t) => {
  const api = new Neutrino();

  t.throws(
    () => api.use(mw({ links: [] })),
    /no longer supports the "links" option/,
  );
});

test('does not throw when links defined with custom template', (t) => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw({ links: [], template: 'custom.html' })));
});
