import test from 'ava';
import { validate } from 'webpack';
import Neutrino from 'neutrino';

test('loads preset', t => {
  t.notThrows(() => require('..'));
});

test('uses preset', t => {
  const api = new Neutrino();

  t.notThrows(() => api.use(require('..')));
});

test('valid preset', t => {
  const api = new Neutrino();
  
  api.use(require('..'));

  const errors = validate(api.getWebpackConfig());

  t.is(errors.length, 0);
});
