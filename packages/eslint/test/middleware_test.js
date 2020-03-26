import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';
import neutrino from '../../neutrino';

const mw = (...args) => require('..')(...args);
const options = { eslint: { rules: { semi: false } } };

test('loads middleware', (t) => {
  t.notThrows(() => require('..'));
});

test('uses middleware', (t) => {
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

test('supports formatter being the name of an ESLint built-in formatter', (t) => {
  const api = new Neutrino();
  const formatter = 'compact';
  api.use(mw({ eslint: { formatter } }));

  const loaderOptions = api.config.module
    .rule('lint')
    .use('eslint')
    .get('options');
  t.is(loaderOptions.formatter, formatter);
});

test('supports formatter being a resolved path', (t) => {
  const api = new Neutrino();
  const formatter = require.resolve('eslint/lib/cli-engine/formatters/compact');
  api.use(mw({ eslint: { formatter } }));

  const loaderOptions = api.config.module
    .rule('lint')
    .use('eslint')
    .get('options');
  t.is(loaderOptions.formatter, formatter);
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

test('throws when used after a compile preset', (t) => {
  const api = new Neutrino();
  api.use(require('../../web')());

  t.throws(() => api.use(mw()), /Lint presets must be defined prior/);
});

test('throws when used twice', (t) => {
  const api = new Neutrino();
  api.use(mw());
  t.throws(
    () => api.use(mw()),
    /@neutrinojs\/eslint has been used twice with the same ruleId of 'lint'/,
  );
});

test('throws when invalid eslint-loader options are passed', (t) => {
  const api = new Neutrino();
  const options = {
    eslint: {
      envs: ['jest'],
      globals: ['browser'],
      plugins: ['react'],
      // Invalid (since should be under `baseConfig`)
      env: {},
      extends: [],
      overrides: [],
      root: false,
      settings: {},
    },
  };
  t.throws(
    () => api.use(mw(options)),
    /Unrecognised 'eslint' option\(s\): env, extends, overrides, root, settings\nValid options are: allowInlineConfig, /,
  );
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
    },
    cache: true,
    cwd: api.options.root,
    emitWarning: false,
    failOnError: true,
    formatter: 'codeframe',
    useEslintrc: false,
  });

  const eslintrc = api.outputHandlers.get('eslintrc')(api);
  t.deepEqual(eslintrc, {
    env: {
      es6: true,
    },
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
    rules: {},
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
          env: {
            jasmine: true,
          },
          extends: ['eslint-config-splendid'],
          globals: {
            jQuery: true,
          },
          overrides: [
            {
              files: '/app/src/custom.js',
              rules: {
                'no-console': 'off',
              },
            },
          ],
          parser: require.resolve('babel-eslint'),
          parserOptions: {
            jsx: true,
          },
          plugins: ['react'],
          rules: {
            quotes: ['error', 'single'],
          },
          settings: {
            react: {
              version: '16.5',
            },
          },
        },
        envs: ['jest'],
        globals: ['$'],
        parser: 'esprima',
        parserOptions: {
          sourceType: 'script',
        },
        plugins: ['jest'],
        reportUnusedDisableDirectives: true,
        rules: {
          quotes: 'warn',
        },
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
        jasmine: true,
      },
      extends: ['eslint-config-splendid'],
      globals: {
        jQuery: true,
        process: true,
      },
      overrides: [
        {
          files: '/app/src/custom.js',
          rules: {
            'no-console': 'off',
          },
        },
      ],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 2018,
        jsx: true,
        sourceType: 'module',
      },
      plugins: ['babel', 'react'],
      root: true,
      rules: {
        quotes: ['error', 'single'],
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
    envs: ['jest'],
    failOnError: true,
    formatter: 'codeframe',
    globals: ['$'],
    parser: 'esprima',
    parserOptions: {
      sourceType: 'script',
    },
    plugins: ['jest'],
    reportUnusedDisableDirectives: true,
    rules: {
      quotes: 'warn',
    },
    useEslintrc: false,
  });

  const eslintrc = api.outputHandlers.get('eslintrc')(api);
  t.deepEqual(eslintrc, {
    env: {
      es6: true,
      jasmine: true,
      jest: true,
    },
    extends: ['eslint-config-splendid'],
    globals: {
      $: true,
      jQuery: true,
      process: true,
    },
    overrides: [
      {
        files: '/app/src/custom.js',
        rules: {
          'no-console': 'off',
        },
      },
    ],
    parser: 'esprima',
    parserOptions: {
      ecmaVersion: 2018,
      jsx: true,
      sourceType: 'script',
    },
    plugins: ['babel', 'react', 'jest'],
    root: true,
    rules: {
      quotes: 'warn',
    },
    settings: {
      react: {
        version: '16.5',
      },
    },
  });
});

test('sets only loader-specific defaults if useEslintrc true', (t) => {
  const api = new Neutrino();
  api.use(mw({ eslint: { useEslintrc: true } }));

  const lintRule = api.config.module.rule('lint');
  t.deepEqual(lintRule.get('test'), /\.(mjs|jsx|js)$/);
  t.deepEqual(lintRule.include.values(), [
    api.options.source,
    api.options.tests,
  ]);
  t.deepEqual(lintRule.exclude.values(), []);
  t.deepEqual(lintRule.use('eslint').get('options'), {
    baseConfig: {},
    cache: true,
    cwd: api.options.root,
    emitWarning: false,
    failOnError: true,
    formatter: 'codeframe',
    useEslintrc: true,
  });
});

test('eslintrc output handler throws if useEslintrc true', (t) => {
  const api = new Neutrino();
  api.use(mw({ eslint: { useEslintrc: true } }));

  t.throws(
    () => api.outputHandlers.get('eslintrc')(api),
    /`useEslintrc` has been set to `true`/,
  );
});
