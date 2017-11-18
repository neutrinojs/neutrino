const web = require('neutrino-preset-web');
const { join } = require('path');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    hot: true,
    babel: {
      presets: [require.resolve('babel-preset-preact')],
      plugins: [
        [
          require.resolve('babel-plugin-transform-react-jsx'),
          { pragma: 'Preact.h' }
        ],
        require.resolve('babel-plugin-transform-object-rest-spread'),
        process.env.NODE_ENV !== 'development' ?
          [require.resolve('babel-plugin-transform-class-properties'), { spec: true }] :
          {}
      ],
      env: {
        development: {
          plugins: [
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
      .alias
        .set('react', 'preact-compat')
        .set('react-dom', 'preact-compat')
        .end()
      .end()
    .resolveLoader.modules.add(MODULES).end().end()
    .when(process.env.NODE_ENV === 'development', config => config
      .entry('index')
      .prepend(require.resolve('webpack/hot/only-dev-server')));
};
