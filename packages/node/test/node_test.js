import test from 'ava';
import { validate } from 'webpack';
import { Neutrino } from 'neutrino';

const expectedExtensions = ['.js', '.jsx', '.vue', '.ts', '.tsx', '.mjs', '.json'];

test('loads preset', t => {
  t.notThrows(() => require('..'));
});

test('uses preset', t => {
  const api = Neutrino();

  t.notThrows(() => api.use(require('..')));
});

test('uses preset with custom main', t => {
  const api = Neutrino({ mains: { server: 'server' } });

  t.notThrows(() => api.use(require('..')));
  t.true(api.config.entryPoints.has('server'));
});

test('valid preset production', t => {
  const api = Neutrino({
    command: 'build',
    env: { NODE_ENV: 'production' }
  });
  api.use(require('..'));
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'node');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);

  // NODE_ENV/command specific
  t.is(config.mode, 'production');
  t.is(config.devtool, 'source-map');

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset development', t => {
  const api = Neutrino({
    command: 'start',
    env: { NODE_ENV: 'development' }
  });
  api.use(require('..'));
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'node');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);

  // NODE_ENV/command specific
  t.is(config.mode, 'development');
  t.is(config.devtool, 'inline-sourcemap');

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset test', t => {
  const api = Neutrino({
    command: 'test',
    env: { NODE_ENV: 'test' }
  });
  api.use(require('..'));
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'node');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);

  // NODE_ENV/command specific
  t.is(config.mode, 'development');
  t.is(config.devtool, 'source-map');

  const errors = validate(config);
  t.is(errors.length, 0);
});
