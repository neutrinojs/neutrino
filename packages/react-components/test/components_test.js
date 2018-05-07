import test from 'ava';
import { validate } from 'webpack';
import Neutrino from '../../neutrino/Neutrino';

test('loads preset', t => {
  t.notThrows(() => require('..'));
});

test('uses preset', t => {
  const api = new Neutrino({ root: __dirname });

  t.notThrows(() => api.use(require('..'), { name: 'alpha' }));
});

test('valid preset production', t => {
  const api = new Neutrino({ root: __dirname });

  api.config.mode('production');
  api.use(require('..'));
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.is(config.optimization.runtimeChunk, false);
  t.is(config.optimization.splitChunks, false);

  // NODE_ENV/command specific
  t.is(config.mode, 'production');
  t.true(config.optimization.minimize);
  t.is(config.devtool, 'source-map');
  t.is(config.devServer, undefined);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset development', t => {
  const api = new Neutrino({ root: __dirname });

  api.config.mode('development');
  api.use(require('..'));
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.is(config.optimization.runtimeChunk, 'single');
  t.is(config.optimization.splitChunks.chunks, 'all');

  const errors = validate(config);
  t.is(errors.length, 0);
});
