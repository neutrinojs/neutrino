import test from 'ava';
import { validate } from 'webpack';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const newExtensions = ['.web.jsx', '.web.js'];
const originalNodeEnv = process.env.NODE_ENV;

test.afterEach(() => {
  // Restore the original NODE_ENV after each test (which Ava defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads preset', t => {
  t.notThrows(mw);
});

test('uses preset', t => {
  t.notThrows(() => new Neutrino().use(mw()));
});

test('valid preset production', t => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  // Common
  t.deepEqual(config.resolve.extensions.slice(0, newExtensions.length), newExtensions);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset development', t => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  // Common
  t.deepEqual(config.resolve.extensions.slice(0, newExtensions.length), newExtensions);

  const errors = validate(config);
  t.is(errors.length, 0);
});

test('valid preset test', t => {
  process.env.NODE_ENV = 'test';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  // Common
  t.deepEqual(config.resolve.extensions.slice(0, newExtensions.length), newExtensions);

  const errors = validate(config);
  t.is(errors.length, 0);
});
