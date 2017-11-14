import test from 'ava';
import { validate } from 'webpack';
import { Neutrino } from 'neutrino';

test('loads preset', t => {
  t.notThrows(() => require('..'));
});

test('uses preset', t => {
  t.notThrows(() => Neutrino().use(require('..')));
});

test('valid preset production', t => {
  const api = Neutrino({ env: { NODE_ENV: 'production' } });

  api.use(require('..'));

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});

test('valid preset development', t => {
  const api = Neutrino({ 'env': { NODE_ENV: 'development' } });

  api.use(require('..'));

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});
