import test from 'ava';
import { validate } from 'webpack';
import Neutrino from '../../neutrino/Neutrino';

const expectedExtensions = ['.js', '.jsx', '.vue', '.ts', '.tsx', '.mjs', '.json'];

test('loads preset', t => {
  t.notThrows(() => require('..'));
});

test('uses preset', t => {
  t.notThrows(() => new Neutrino().use(require('..')));
});

test('valid preset production', t => {
  const api = new Neutrino();

  api.config.mode('production');
  api.use(require('..'));
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization.runtimeChunk, 'single');
  t.is(config.optimization.splitChunks.chunks, 'all');

  // NODE_ENV/command specific
  t.is(config.mode, 'production');
  t.true(config.optimization.minimize);
  t.false(config.optimization.splitChunks.name);
  t.is(config.devtool, undefined);
  t.is(config.devServer, undefined);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset development', t => {
  const api = new Neutrino();

  api.config.mode('development');
  api.use(require('..'));
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization.runtimeChunk, 'single');
  t.is(config.optimization.splitChunks.chunks, 'all');

  // NODE_ENV/command specific
  t.is(config.mode, 'development');
  t.false(config.optimization.minimize);
  t.true(config.optimization.splitChunks.name);
  t.is(config.devtool, 'cheap-module-eval-source-map');
  t.not(config.devServer, undefined);
  t.is(config.devServer.host, '0.0.0.0');
  t.is(config.devServer.port, 5000);
  t.is(config.devServer.public, 'localhost:5000');
  t.is(config.devServer.publicPath, '/');

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('throws when minify.babel defined', async t => {
  const api = new Neutrino();

  const err = t.throws(() => api.use(require('..'), { minify: { babel: false } }));
  t.true(err.message.includes('The minify.babel option has been removed'));
});

test('throws when minify.image defined', async t => {
  const api = new Neutrino();

  const err = t.throws(() => api.use(require('..'), { minify: { image: true } }));
  t.true(err.message.includes('The minify.image option has been removed'));
});
