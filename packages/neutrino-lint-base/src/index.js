const clone = require('lodash.clonedeep');
const path = require('path');

const MODULES = path.join(__dirname, '../node_modules');
const IF_NOT_DEV =  process.env.NODE_ENV !== 'development';

module.exports = neutrino => {
  const { config } = neutrino;

  config
    .module
      .rule('lint')
        .test(/\.(js|jsx)$/)
        .pre()
        .include(path.join(process.cwd(), 'src'))
        .loader('eslint', require.resolve('eslint-loader'), {
          failOnError: IF_NOT_DEV,
          emitWarning: IF_NOT_DEV,
          emitError: IF_NOT_DEV,
          cwd: process.cwd(),
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
        });

  config.resolve.modules.add(MODULES);
  config.resolveLoader.modules.add(MODULES);

  neutrino.eslintrc = () => {
    const options = clone(config.module.rule('lint').loaders.get('eslint').options);

    options.extends = options.baseConfig.extends;
    options.useEslintrc = true;
    options.env = options.envs.reduce((env, key) => Object.assign(env, { [key]: true }), {});
    options.globals = options.globals.reduce((globals, key) => Object.assign(globals, { [key]: true }), {});
    ['envs', 'baseConfig', 'failOnError', 'emitWarning', 'emitError'].map(method => delete options[method]);

    return options;
  };
};
