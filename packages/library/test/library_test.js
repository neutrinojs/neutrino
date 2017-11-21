import test from 'ava';
import { validate } from 'webpack';
import { Neutrino } from 'neutrino';

test('loads preset', t => {
  t.notThrows(() => require('..'));
});

test('uses preset', t => {
  const api = Neutrino();

  t.notThrows(() => api.use(require('..'), { name: 'alpha' }));
});

test('throws when missing library name', t => {
  const api = Neutrino();

  t.throws(() => api.use(require('..')));
});

test('valid preset production', t => {
  const api = Neutrino({ env: { NODE_ENV: 'production' } });
  
  api.use(require('..'), { name: 'alpha' });

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});

test('valid preset development', t => {
  const api = Neutrino({ 'env': { NODE_ENV: 'development' } });

  api.use(require('..'), { name: 'alpha' });

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});

test('valid preset Node.js target', t => {
  const api = Neutrino({ 'env': { NODE_ENV: 'development' } });

  api.use(require('..'), { name: 'alpha', target: 'node' });

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});

test('valid preset commonjs2 libraryTarget', t => {
  const api = Neutrino({ 'env': { NODE_ENV: 'development' } });

  api.use(require('..'), { name: 'alpha', libraryTarget: 'commonjs2' });

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});
