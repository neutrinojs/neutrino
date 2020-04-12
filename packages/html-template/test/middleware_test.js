const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const options = { title: 'Alpha Beta', appMountId: 'app' };

test('loads middleware', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses middleware', () => {
  const api = new Neutrino();

  expect(() => api.use(mw())).not.toThrow();
});

test('uses with options', () => {
  const api = new Neutrino();

  expect(() => api.use(mw(options))).not.toThrow();
});

test('instantiates', () => {
  const api = new Neutrino();

  api.use(mw());

  expect(() => api.config.toConfig()).not.toThrow();
});

test('instantiates with options', () => {
  const api = new Neutrino();

  api.use(mw(options));

  expect(() => api.config.toConfig()).not.toThrow();
});

test('throws when links defined with default template', () => {
  const api = new Neutrino();

  expect(() => api.use(mw({ links: [] }))).toThrow(
    /no longer supports the "links" option/,
  );
});

test('does not throw when links defined with custom template', () => {
  const api = new Neutrino();

  expect(() =>
    api.use(mw({ links: [], template: 'custom.html' })),
  ).not.toThrow();
});
