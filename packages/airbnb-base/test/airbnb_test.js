import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';
import neutrino from '../../neutrino';

const mw = (...args) => require('..')(...args);
const options = { eslint: { rules: { semi: false } } };

test('loads preset', (t) => {
  t.notThrows(() => require('..'));
});

test('uses preset', (t) => {
  t.notThrows(() => new Neutrino().use(mw()));
});

test('uses with options', (t) => {
  t.notThrows(() => new Neutrino().use(mw(options)));
});

test('instantiates', (t) => {
  const api = new Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', (t) => {
  const api = new Neutrino();

  api.use(mw(options));

  t.notThrows(() => api.config.toConfig());
});

test('exposes eslintrc output handler', (t) => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('eslintrc');

  t.is(typeof handler, 'function');
});

test('exposes eslintrc config from output', (t) => {
  const config = neutrino(mw()).output('eslintrc');

  t.is(typeof config, 'object');
});

test('exposes eslintrc method', (t) => {
  t.is(typeof neutrino(mw()).eslintrc, 'function');
});

test('exposes eslintrc config from method', (t) => {
  t.is(typeof neutrino(mw()).eslintrc(), 'object');
});

test('sets defaults when no options passed', (t) => {
  const api = new Neutrino();
  api.use(mw());

  const lintRule = api.config.module.rule('lint');
  t.deepEqual(lintRule.get('test'), /\.(mjs|jsx|js)$/);
  t.deepEqual(lintRule.include.values(), [
    api.options.source,
    api.options.tests,
  ]);
  t.deepEqual(lintRule.exclude.values(), []);
  t.deepEqual(lintRule.use('eslint').get('options'), {
    baseConfig: {
      env: {
        es6: true,
      },
      extends: [require.resolve('eslint-config-airbnb-base')],
      globals: {
        process: true,
      },
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      plugins: ['babel'],
      root: true,
      rules: {
        'babel/new-cap': [
          'error',
          {
            capIsNew: false,
            capIsNewExceptions: [
              'Immutable.Map',
              'Immutable.Set',
              'Immutable.List',
            ],
            newIsCap: true,
            newIsCapExceptions: [],
          },
        ],
        'babel/no-invalid-this': 'off',
        'babel/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: false,
            allowTaggedTemplates: false,
            allowTernary: false,
          },
        ],
        'babel/object-curly-spacing': ['error', 'always'],
        'babel/semi': ['error', 'always'],
        'new-cap': 'off',
        'no-invalid-this': 'off',
        'no-unused-expressions': 'off',
        'object-curly-spacing': 'off',
        semi: 'off',
      },
    },
    cache: true,
    cwd: api.options.root,
    emitWarning: false,
    failOnError: true,
    formatter: 'codeframe',
    useEslintrc: false,
  });
});

test('merges options with defaults', (t) => {
  const api = new Neutrino();
  api.use(
    mw({
      test: /\.js$/,
      include: ['/app/src'],
      exclude: [/node_modules/],
      eslint: {
        baseConfig: {
          extends: ['eslint-config-splendid'],
          globals: {
            jQuery: true,
          },
          plugins: ['jest'],
          rules: {
            'babel/no-unused-expressions': 'warn',
          },
          settings: {
            react: {
              version: '16.5',
            },
          },
        },
        reportUnusedDisableDirectives: true,
      },
    }),
  );

  const lintRule = api.config.module.rule('lint');
  t.deepEqual(lintRule.get('test'), /\.js$/);
  t.deepEqual(lintRule.include.values(), ['/app/src']);
  t.deepEqual(lintRule.exclude.values(), [/node_modules/]);
  t.deepEqual(lintRule.use('eslint').get('options'), {
    baseConfig: {
      env: {
        es6: true,
      },
      extends: [
        require.resolve('eslint-config-airbnb-base'),
        'eslint-config-splendid',
      ],
      globals: {
        jQuery: true,
        process: true,
      },
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      plugins: ['babel', 'jest'],
      root: true,
      rules: {
        'babel/new-cap': [
          'error',
          {
            capIsNew: false,
            capIsNewExceptions: [
              'Immutable.Map',
              'Immutable.Set',
              'Immutable.List',
            ],
            newIsCap: true,
            newIsCapExceptions: [],
          },
        ],
        'babel/no-invalid-this': 'off',
        'babel/no-unused-expressions': 'warn',
        'babel/object-curly-spacing': ['error', 'always'],
        'babel/semi': ['error', 'always'],
        'new-cap': 'off',
        'no-invalid-this': 'off',
        'no-unused-expressions': 'off',
        'object-curly-spacing': 'off',
        semi: 'off',
      },
      settings: {
        react: {
          version: '16.5',
        },
      },
    },
    cache: true,
    cwd: api.options.root,
    emitWarning: false,
    failOnError: true,
    formatter: 'codeframe',
    reportUnusedDisableDirectives: true,
    useEslintrc: false,
  });
});
