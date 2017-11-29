const web = require('@neutrinojs/web');
const loaderMerge = require('@neutrinojs/loader-merge');
const { join } = require('path');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    hot: true,
    babel: {
      plugins: [
        [
          require.resolve('babel-plugin-transform-react-jsx'),
          { pragma: 'h' }
        ],
        [
          require.resolve('babel-plugin-jsx-pragmatic'),
          {
            module: 'preact',
            export: 'h',
            import: 'h'
          }
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
    .resolveLoader
      .modules
        .add(MODULES)
        .end()
      .end()
    .resolve
      .modules.add(MODULES).end()
      .extensions.add('.jsx').end()
      .alias
        .set('react', 'preact-compat')
        .set('react-dom', 'preact-compat')
        .set('create-react-class', 'preact-compat/lib/create-react-class')
        .set('react-addons-css-transition-group', 'preact-css-transition-group');

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      rules: {
        'react/react-in-jsx-scope': 'off'
      }
    });
  });
};
