import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const options = { rules: ['image'] };

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

test('uses with options', t => {
  t.notThrows(() => {
    const api = new Neutrino();

    api.config.mode('production');
    api.use(mw(), options)
  });
});

test('instantiates', t => {
  const api = new Neutrino();

  api.config.mode('production');
  api.use(mw());

  t.true(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', t => {
  const api = new Neutrino();

  api.config.mode('production');
  api.use(mw(), options);

  t.true(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});

test('disabled in development', t => {
  const api = new Neutrino();

  api.config.mode('development');
  api.use(mw(), options);

  t.false(api.config.plugins.has('imagemin'));
  t.notThrows(() => api.config.toConfig());
});
