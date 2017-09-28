const web = require('neutrino-preset-web');
const compileLoader = require('neutrino-middleware-compile-loader');
const loaderMerge = require('neutrino-middleware-loader-merge');
const { join } = require('path');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    hot: true,
    babel: {}
  }, opts);

  Object.assign(options, {
    babel: compileLoader.merge({
      plugins: [
        require.resolve('babel-plugin-transform-object-rest-spread'),
        ...(process.env.NODE_ENV !== 'development' ?
          [[require.resolve('babel-plugin-transform-class-properties'), { spec: true }]] :
          [])
      ],
      presets: [require.resolve('babel-preset-react')],
      env: {
        development: {
          plugins: [
            ...(options.hot ? [require.resolve('react-hot-loader/babel')] : []),
            [require.resolve('babel-plugin-transform-class-properties'), { spec: true }],
            require.resolve('babel-plugin-transform-es2015-classes')
          ]
        }
      }
    }, options.babel)
  });

  neutrino.use(web, options);

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      plugins: ['react']
    });
  });

  neutrino.config
    .resolve
      .modules.add(MODULES).end()
      .extensions.add('.jsx').end()
      .alias.set('react-native', 'react-native-web').end()
      .end()
    .resolveLoader.modules.add(MODULES).end().end()
    .when(process.env.NODE_ENV === 'development' && options.hot, config => config
      .entry('index')
        .prepend(require.resolve('react-hot-loader/patch')));
};
