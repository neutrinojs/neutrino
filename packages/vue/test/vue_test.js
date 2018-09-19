import test from 'ava';
import { validate } from 'webpack';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const originalNodeEnv = process.env.NODE_ENV;
const expectedExtensions = ['.wasm', '.mjs', '.jsx', '.vue', '.js', '.json'];

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

  const errors = validate(config);
  t.deepEqual(config.resolve.extensions, expectedExtensions);

  t.is(errors.length, 0);
});

test('valid preset development', t => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  const errors = validate(config);
  t.deepEqual(config.resolve.extensions, expectedExtensions);

  t.is(errors.length, 0);
});
