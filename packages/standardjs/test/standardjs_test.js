const Neutrino = require('../../neutrino/Neutrino');
const neutrino = require('../../neutrino');

const mw = (...args) => require('..')(...args);
const options = { eslint: { rules: { semi: false } } };

test('loads preset', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses preset', () => {
  expect(() => new Neutrino().use(mw())).not.toThrow();
});

test('uses with options', () => {
  expect(() => new Neutrino().use(mw(options))).not.toThrow();
});

test('instantiates', () => {
  const api = new Neutrino();

  api.use(mw());

  expect(() => api.config.toConfig()).not.toThrow();
});

test('instantiates with options', () => {
  const api = new Neutrino();

  api.use(mw(options));

  expect(() => api.config.toConfig()).not.toThrow();
});

test('exposes eslintrc output handler', () => {
  const api = new Neutrino();

  api.use(mw());

  const handler = api.outputHandlers.get('eslintrc');

  expect(typeof handler).toBe('function');
});

test('exposes eslintrc config from output', () => {
  const config = neutrino(mw()).output('eslintrc');

  expect(typeof config).toBe('object');
});

test('exposes eslintrc method', () => {
  expect(typeof neutrino(mw()).eslintrc).toBe('function');
});

test('exposes eslintrc config from method', () => {
  expect(typeof neutrino(mw()).eslintrc()).toBe('object');
});

test('sets defaults when no options passed', () => {
  const api = new Neutrino();
  api.use(mw());

  const lintRule = api.config.module.rule('lint');
  expect(lintRule.get('test')).toEqual(/\.(mjs|jsx|js)$/);
  expect(lintRule.include.values()).toEqual([
    api.options.source,
    api.options.tests,
  ]);
  expect(lintRule.exclude.values()).toEqual([]);
  expect(lintRule.use('eslint').get('options')).toEqual({
    baseConfig: {
      env: {
        es6: true,
      },
      extends: [
        require.resolve('eslint-config-standard'),
        require.resolve('eslint-config-standard-react'),
      ],
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
            newIsCap: true,
            properties: true,
          },
        ],
        'babel/no-invalid-this': 'off',
        'babel/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'babel/object-curly-spacing': ['error', 'always'],
        'babel/semi': ['error', 'never'],
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

test('merges options with defaults', () => {
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
  expect(lintRule.get('test')).toEqual(/\.js$/);
  expect(lintRule.include.values()).toEqual(['/app/src']);
  expect(lintRule.exclude.values()).toEqual([/node_modules/]);
  expect(lintRule.use('eslint').get('options')).toEqual({
    baseConfig: {
      env: {
        es6: true,
      },
      extends: [
        require.resolve('eslint-config-standard'),
        require.resolve('eslint-config-standard-react'),
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
            newIsCap: true,
            properties: true,
          },
        ],
        'babel/no-invalid-this': 'off',
        'babel/no-unused-expressions': 'warn',
        'babel/object-curly-spacing': ['error', 'always'],
        'babel/semi': ['error', 'never'],
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
