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
        [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }],
        // Using loose for the reasons here:
        // https://github.com/facebook/create-react-app/issues/4263
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
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
      plugins: ['react'],
      baseConfig: {
        settings: {
          react: {
            pragma: 'h'
          }
        }
      }
    });
  });
};
