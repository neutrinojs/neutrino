import test from 'ava';
import { validate } from 'webpack';
import lint from '../../eslint';
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

test('updates lint config by default', t => {
  const api = new Neutrino();
  api.use(lint);
  api.use(mw());

  const lintRule = api.config.module.rule('lint');
  t.deepEqual(lintRule.get('test'), /\.(wasm|mjs|jsx|vue|js)$/);
  t.deepEqual(lintRule.use('eslint').get('options').baseConfig, {
    env: {
      browser: true,
      commonjs: true,
      es6: true
    },
    extends: ['plugin:vue/base'],
    globals: {
      process: true
    },
    overrides: [],
    parser: 'vue-eslint-parser',
    parserOptions: {
      ecmaVersion: 2018,
      parser: 'babel-eslint',
      sourceType: 'module'
    },
    plugins: [
      'babel',
      'vue'
    ],
    root: true,
    settings: {}
  });
});

test('does not update lint config if useEslintrc true', t => {
  const api = new Neutrino();
  api.use(lint, { eslint: { useEslintrc: true } });
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  t.deepEqual(options.baseConfig, {});
});
