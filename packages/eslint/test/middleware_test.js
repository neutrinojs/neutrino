const Neutrino = require('../../neutrino/Neutrino');
const neutrino = require('../../neutrino');

const mw = (...args) => require('..')(...args);
const options = { eslint: { rules: { semi: false } } };

test('loads middleware', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses middleware', () => {
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

test('supports formatter being the name of an ESLint built-in formatter', () => {
  const api = new Neutrino();
  const formatter = 'compact';
  api.use(mw({ eslint: { formatter } }));

  const loaderOptions = api.config.module
    .rule('lint')
    .use('eslint')
    .get('options');
  expect(loaderOptions.formatter).toBe(formatter);
});

test('supports formatter being a resolved path', () => {
  const api = new Neutrino();
  const formatter = require.resolve('eslint/lib/cli-engine/formatters/compact');
  api.use(mw({ eslint: { formatter } }));

  const loaderOptions = api.config.module
    .rule('lint')
    .use('eslint')
    .get('options');
  expect(loaderOptions.formatter).toBe(formatter);
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

test('throws when used after a compile preset', () => {
  const api = new Neutrino();
  api.use(require('../../web')());

  expect(() => api.use(mw())).toThrow(/Lint presets must be defined prior/);
});

test('throws when used twice', () => {
  const api = new Neutrino();
  api.use(mw());
  expect(() => api.use(mw())).toThrow(
    /@neutrinojs\/eslint has been used twice with the same ruleId of 'lint'/,
  );
});

test('throws when invalid eslint-loader options are passed', () => {
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
  expect(() => api.use(mw(options))).toThrow(
    /Unrecognised 'eslint' option\(s\): env, extends, overrides, root, settings\nValid options are: allowInlineConfig, /,
  );
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
  expect(eslintrc).toEqual({
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

test('merges options with defaults', () => {
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
  expect(lintRule.get('test')).toEqual(/\.js$/);
  expect(lintRule.include.values()).toEqual(['/app/src']);
  expect(lintRule.exclude.values()).toEqual([/node_modules/]);
  expect(lintRule.use('eslint').get('options')).toEqual({
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
  expect(eslintrc).toEqual({
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

test('sets only loader-specific defaults if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(mw({ eslint: { useEslintrc: true } }));

  const lintRule = api.config.module.rule('lint');
  expect(lintRule.get('test')).toEqual(/\.(mjs|jsx|js)$/);
  expect(lintRule.include.values()).toEqual([
    api.options.source,
    api.options.tests,
  ]);
  expect(lintRule.exclude.values()).toEqual([]);
  expect(lintRule.use('eslint').get('options')).toEqual({
    baseConfig: {},
    cache: true,
    cwd: api.options.root,
    emitWarning: false,
    failOnError: true,
    formatter: 'codeframe',
    useEslintrc: true,
  });
});

test('eslintrc output handler throws if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(mw({ eslint: { useEslintrc: true } }));

  expect(() => api.outputHandlers.get('eslintrc')(api)).toThrow(
    /`useEslintrc` has been set to `true`/,
  );
});
