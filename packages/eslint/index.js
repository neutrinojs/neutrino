const deepmerge = require('deepmerge');
const clone = require('lodash.clonedeep');
const omit = require('lodash.omit');
const { join } = require('path');

const MODULES = join(__dirname, 'node_modules');

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
const eslintrc = (neutrino, override) => {
  const options = omit(
    clone(
      neutrino.config.module
        .rule('lint')
        .use('eslint')
        .get('options')
    ),
    // We remove these keys since they are needed when running the lint command
    // but not the eslintrc command. The lint command uses ESLint's CLIEngine,
    // but the ESLint RC format does not match the CLIEngine format exactly. We
    // must remove anything we add that does not comply with ESLint's schemas.
    // https://github.com/eslint/eslint/blob/9d1df92628dd4dd1e70fbb19454008e146387435/conf/config-schema.js
    // https://github.com/eslint/eslint/blob/9d1df92628dd4dd1e70fbb19454008e146387435/lib/config/config-validator.js#L167
    [
      'failOnError',
      'emitWarning',
      'emitError',
      'cwd',
      'useEslintrc',
      'fix',
      'extensions',
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

  return override(options);
};

module.exports = (neutrino, opts = {}) => {
  const defaults = {
    include: !opts.include ? [neutrino.options.source] : undefined,
    eslint: {
      failOnError: neutrino.config.get('mode') === 'production',
      cwd: neutrino.options.root,
      useEslintrc: false,
      root: true,
      formatter: 'codeframe',
      // eslint-loader uses executeOnText(), which ignores the `extensions` setting.
      // However it's still needed for the lint command, as it uses executeOnFiles().
      extensions: neutrino.options.extensions,
      plugins: ['babel'],
      baseConfig: {},
      envs: ['es6'],
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
          objectLiteralDuplicateProperties: false,
          generators: true,
          impliedStrict: true
        }
      },
      settings: {},
      globals: ['process'],
      rules: {}
    }
  };
  const options = merge(defaults, opts);
  const loaderOptions = typeof options.eslint.formatter === 'string'
    ? deepmerge(options.eslint, {
      // eslint-disable-next-line global-require
      formatter: require(`eslint/lib/formatters/${options.eslint.formatter}`)
    })
    : options.eslint;

  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);
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
