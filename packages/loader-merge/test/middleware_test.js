import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const options = { alpha: 'beta' };

test('loads middleware', t => {
  t.notThrows(() => require('..'));
});

test('uses with options', t => {
  const api = new Neutrino();

  api.config.module.rule('alpha').use('beta').options(options);

  t.notThrows(() => api.use(require('..')('alpha', 'beta'), {}));
});

test('throws without options', t => {
  const api = new Neutrino();

  api.config.module.rule('alpha').use('beta').options(options);

  t.throws(() => api.use(require('..')('alpha', 'beta')));
});

test('instantiates with options', t => {
  const api = new Neutrino();

  api.config.module.rule('alpha').use('beta').options(options);
  api.use(require('..')('alpha', 'beta'), options);

  t.notThrows(() => api.config.toConfig());
});
