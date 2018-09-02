import test from 'ava';
import { validate } from 'webpack';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const expectedExtensions = ['.js', '.jsx', '.vue', '.ts', '.tsx', '.mjs', '.json'];
const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads preset', t => {
  t.notThrows(mw);
});

test('uses preset', t => {
  const api = new Neutrino();

  t.notThrows(() => api.use(mw(), { name: 'alpha' }));
});

test('throws when missing library name', t => {
  const api = new Neutrino();

  const err = t.throws(() => api.use(mw()));
  t.true(err.message.includes('You must specify a library name'));
});

test('valid preset production', t => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();

  api.use(mw(), { name: 'alpha' });
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);
  t.deepEqual(config.stats, {
    children: false,
    entrypoints: false,
    modules: false
  });

  // NODE_ENV/command specific
  t.is(config.devtool, 'source-map');
  t.not(config.externals, undefined);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset development', t => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();

  api.use(mw(), { name: 'alpha' });
  const config = api.config.toConfig();

  // Common
  t.is(config.target, 'web');
  t.deepEqual(config.resolve.extensions, expectedExtensions);
  t.is(config.optimization, undefined);
  t.is(config.devServer, undefined);
  t.deepEqual(config.stats, {
    children: false,
    entrypoints: false,
    modules: false
  });

  // NODE_ENV/command specific
  t.is(config.devtool, 'source-map');
  t.not(config.externals, undefined);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset Node.js target', t => {
  const api = new Neutrino();
  api.use(mw(), { name: 'alpha', target: 'node' });

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});

test('valid preset commonjs2 libraryTarget', t => {
  const api = new Neutrino();
  api.use(mw(), { name: 'alpha', libraryTarget: 'commonjs2' });

  const errors = validate(api.config.toConfig());

  t.is(errors.length, 0);
});
