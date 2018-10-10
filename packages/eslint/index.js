const deepmerge = require('deepmerge');
const clone = require('lodash.clonedeep');
const omit = require('lodash.omit');

const merge = (source, destination) => {
  const sourceRules = (source && source.eslint && source.eslint.rules) || {};
  const destinationRules = (
    destination &&
    destination.eslint &&
    destination.eslint.rules
  ) || {};
  const rules = deepmerge(sourceRules, destinationRules, {
    arrayMerge(source, destination) {
      return destination;
    }
  });
  const options = deepmerge(source, destination);

  Object.assign(options.eslint, { rules });

  return options;
};
const eslintrc = (neutrino) => {
  const options = omit(
    clone(
      neutrino.config.module
        .rule('lint')
        .use('eslint')
        .get('options')
    ),
    // Remove keys that are eslint-loader specific, since they'll be rejected by the .eslintrc schema:
    // https://github.com/eslint/eslint/blob/v4.19.1/conf/config-schema.js
    [
      'cache',
      'failOnError',
      'emitWarning',
      'emitError',
      'cwd',
      'useEslintrc',
      'fix',
      'formatter'
    ]
  );

  if (options.envs) {
    Object.assign(options, {
      env: options.envs.reduce((env, key) => Object.assign(
        env,
        { [key]: true }
      ), {})
    });
    Reflect.deleteProperty(options, 'envs');
  }

  if (options.baseConfig) {
    Object.assign(options, {
      extends: options.baseConfig.extends,
      settings: deepmerge(
        options.settings || {},
        options.baseConfig.settings || {}
      )
    });
    Reflect.deleteProperty(options, 'baseConfig');
  }

  if (options.globals) {
    Object.assign(options, {
      globals: options.globals.reduce((globals, key) => Object.assign(
        globals,
        { [key]: true }
      ), {})
    });
  }

  return options;
};

module.exports = (neutrino, opts = {}) => {
  if (neutrino.config.module.rules.has('compile')) {
    throw new Error('Lint presets must be defined prior to any other presets in .neutrinorc.js.');
  }

  if (neutrino.config.module.rules.has('lint')) {
    throw new Error(
      '@neutrinojs/eslint has been used twice.\n' +
      'If you are including this preset manually to customise the ESLint rule\n' +
      "configured by another preset, instead use that preset's own options to do so."
    );
  }

  const defaults = {
    include: !opts.include ? [neutrino.options.source, neutrino.options.tests] : undefined,
    eslint: {
      cache: true,
      // Make errors fatal not just for 'production' but also 'test'.
      failOnError: process.env.NODE_ENV !== 'development',
      cwd: neutrino.options.root,
      useEslintrc: false,
      root: true,
      // Can be the name of a built-in ESLint formatter or the module/path of an external one.
      formatter: 'codeframe',
      // Unfortunately we can't `require.resolve('eslint-plugin-babel')` due to:
      // https://github.com/eslint/eslint/issues/6237
      // ...so we have no choice but to rely on it being hoisted.
      plugins: ['babel'],
      baseConfig: {},
      envs: ['es6'],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
      },
      settings: {},
      globals: ['process'],
      rules: {}
    }
  };
  const options = merge(defaults, opts);
  const loaderOptions = options.eslint;

  if (typeof loaderOptions.formatter === 'string') {
    try {
      loaderOptions.formatter = require.resolve(`eslint/lib/formatters/${loaderOptions.formatter}`);
    } catch (err) {
      // Pass the formatter as-is, since it may be the module name/path of an external formatter.
    }
  }

  neutrino.config
    .module
      .rule('lint')
        .test(options.test || neutrino.regexFromExtensions())
        .pre()
        .when(options.include, rule => rule.include.merge(options.include))
        .when(options.exclude, rule => rule.exclude.merge(options.exclude))
        .use('eslint')
          .loader(require.resolve('eslint-loader'))
          .options(loaderOptions);

  neutrino.register('eslintrc', eslintrc);
};

module.exports.merge = merge;
