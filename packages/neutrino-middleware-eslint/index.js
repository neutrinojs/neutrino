const merge = require('deepmerge');
const clone = require('lodash.clonedeep');
const { join } = require('path');

const IF_NOT_DEV = process.env.NODE_ENV !== 'development';
const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, options) => {
  const { config } = neutrino;
  const lint = config.module.rule('lint');

  config.resolve.modules.add(MODULES);
  config.resolveLoader.modules.add(MODULES);

  lint
    .test(options.test || /\.(js|jsx)$/)
    .pre()
    .use('eslint')
      .loader(require.resolve('eslint-loader'))
      .options(merge({
        failOnError: IF_NOT_DEV,
        emitWarning: IF_NOT_DEV,
        emitError: IF_NOT_DEV,
        cwd: neutrino.options.root,
        useEslintrc: false,
        root: true,
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
      }, options.eslint || {}));

  if (options.include) {
    rule.include.merge(options.include);
  }

  if (options.exclude) {
    rule.exclude.merge(options.exclude);
  }

  neutrino.eslintrc = () => {
    const options = clone(config.module.rule('lint').use('eslint').get('options'));

    options.extends = options.baseConfig.extends;
    options.useEslintrc = true;
    options.env = options.envs.reduce((env, key) => Object.assign(env, { [key]: true }), {});
    options.globals = options.globals.reduce((globals, key) => Object.assign(globals, { [key]: true }), {});
    ['envs', 'baseConfig', 'failOnError', 'emitWarning', 'emitError'].map(method => delete options[method]);

    return options;
  };
};
