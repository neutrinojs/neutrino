import test from 'ava';
import { validate } from 'webpack';
import { Neutrino } from 'neutrino';

const expectedExtensions = ['.js', '.jsx', '.vue', '.ts', '.tsx', '.mjs', '.json'];

test('loads preset', t => {
  t.notThrows(() => require('..'));
});

test('uses preset', t => {
  const api = Neutrino();

  t.notThrows(() => api.use(require('..'), { name: 'alpha' }));
});

test('throws when missing library name', t => {
  const api = Neutrino();

  const err = t.throws(() => api.use(require('..')));
  t.true(err.message.includes('You must specify a library name'));
});

test('valid preset production', t => {
  const api = Neutrino({
    command: 'build',
    env: { NODE_ENV: 'production' }
  });
  api.use(require('..'), { name: 'alpha' });
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);

  // NODE_ENV/command specific
  t.is(config.mode, 'production');
  t.is(config.devtool, 'source-map');
  t.not(config.externals, undefined);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset development', t => {
  const api = Neutrino({
    command: 'start',
    env: { NODE_ENV: 'development' }
  });
  api.use(require('..'), { name: 'alpha' });
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);

  // NODE_ENV/command specific
  t.is(config.mode, 'development');
  t.is(config.devtool, 'source-map');
  t.not(config.externals, undefined);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset test', t => {
  const api = Neutrino({
    command: 'test',
    env: { NODE_ENV: 'test' }
  });
  api.use(require('..'), { name: 'alpha' });
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);

  // NODE_ENV/command specific
  t.is(config.mode, 'development');
  t.is(config.devtool, 'source-map');
  t.is(config.externals, undefined);

  const errors = validate(config);
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
