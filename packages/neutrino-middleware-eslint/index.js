const merge = require('deepmerge');
const clone = require('lodash.clonedeep');
const { join } = require('path');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, options) => {
  const isNotDev = process.env.NODE_ENV !== 'development';

  // eslint-disable-next-line no-param-reassign
  neutrino.eslintrc = () => {
    const options = clone(neutrino.config.module.rule('lint').use('eslint').get('options'));

    options.extends = options.baseConfig.extends;
    options.useEslintrc = true;
    options.env = options.envs.reduce((env, key) => Object.assign(env, { [key]: true }), {});
    options.globals = options.globals.reduce((globals, key) => Object.assign(globals, { [key]: true }), {});
    ['envs', 'baseConfig', 'failOnError', 'emitWarning', 'emitError'].map(method => delete options[method]);

    return options;
  };

  neutrino.config
    .resolve
      .modules
        .add(MODULES)
        .end()
      .end()
    .resolveLoader
      .modules
        .add(MODULES)
        .end()
      .end()
    .module
      .rule('lint')
        .test(options.test || /\.(js|jsx)$/)
        .pre()
        .when(options.include, rule => rule.include.merge(options.include))
        .when(options.exclude, rule => rule.exclude.merge(options.exclude))
        .use('eslint')
          .loader(require.resolve('eslint-loader'))
          .options(merge({
            failOnError: isNotDev,
            emitWarning: isNotDev,
            emitError: isNotDev,
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
};
