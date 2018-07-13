import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const options = { rules: ['image'] };
const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  t.notThrows(() => {
    const api = new Neutrino();

    api.use(mw());
  });
});

test('uses with options', t => {
  t.notThrows(() => {
    const api = new Neutrino();

    api.use(mw(), options);
  });
});

test('instantiates', t => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw());

  t.true(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', t => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw(), options);

  t.true(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});

test('disabled in development', t => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();

  api.use(mw(), options);

  t.false(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});
