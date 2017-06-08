const web = require('neutrino-preset-web');
const { join } = require('path');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    hot: true,
    babel: {
      presets: [require.resolve('babel-preset-react')],
      plugins: [
        require.resolve('babel-plugin-transform-object-rest-spread'),
        process.env.NODE_ENV !== 'development' ?
          [require.resolve('babel-plugin-transform-class-properties'), { spec: true }] :
          {}
      ],
      env: {
        development: {
          plugins: [
            opts.hot !== false ? require.resolve('react-hot-loader/babel') : {},
            [require.resolve('babel-plugin-transform-class-properties'), { spec: true }],
            require.resolve('babel-plugin-transform-es2015-classes')
          ]
        }
      }
    }
  }, opts);

  neutrino.use(web, options);

  neutrino.config
    .resolve
      .modules.add(MODULES).end()
      .extensions.add('.jsx').end()
      .alias.set('react-native', 'react-native-web').end()
      .end()
    .resolveLoader.modules.add(MODULES).end().end()
    .externals({
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    })
    .when(process.env.NODE_ENV === 'development' && options.hot, config => config
      .entry('index')
        .prepend(require.resolve('react-hot-loader/patch')));
};
