const compileLoader = require('@neutrinojs/compile-loader');
const loaderMerge = require('@neutrinojs/loader-merge');
const web = require('@neutrinojs/web');
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
        [require.resolve('babel-plugin-transform-react-jsx'), { pragma: 'h' }],
        [require.resolve('babel-plugin-jsx-pragmatic'), {
          module: 'preact',
          export: 'h',
          import: 'h'
        }],
        require.resolve('babel-plugin-transform-object-rest-spread'),
        [require.resolve('babel-plugin-transform-class-properties'), { spec: true }],
        process.env.NODE_ENV === 'development'
          ? require.resolve('babel-plugin-transform-es2015-classes')
          : {}
      ]
    }, options.babel)
  });

  neutrino.use(web, options);

  neutrino.config
    .resolveLoader
      .modules
        .add(MODULES)
        .end()
      .end()
    .resolve
      .modules.add(MODULES).end()
      .alias
        .set('react', 'preact-compat')
        .set('react-dom', 'preact-compat')
        .set('create-react-class', 'preact-compat/lib/create-react-class')
        .set('react-addons-css-transition-group', 'preact-css-transition-group');

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      rules: {
        // Shutting this off allows ESLint to not fail when using JSX without an explicit
        // "preact" import when coupled with the "jsx-pragmatic" and "transform-react-jsx"
        // babel plugins above
        'react/react-in-jsx-scope': 'off'
      }
    });
  });
};
