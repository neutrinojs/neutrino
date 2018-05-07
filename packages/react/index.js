const web = require('@neutrinojs/web');
const compileLoader = require('@neutrinojs/compile-loader');
const loaderMerge = require('@neutrinojs/loader-merge');
const { join } = require('path');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    hot: true,
    hotEntries: [require.resolve('react-hot-loader/patch')],
    babel: {}
  }, opts);

  Object.assign(options, {
    babel: compileLoader.merge({
      plugins: [
        ...(
          process.env.NODE_ENV === 'development' && options.hot
            ? [require.resolve('react-hot-loader/babel')]
            : []
        ),
        // Using loose for the reasons here:
        // https://github.com/facebook/create-react-app/issues/4263
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
      ],
      presets: [
        [
          require.resolve('@babel/preset-react'),
          {
            // Enable development helpers both in development and testing.
            development: process.env.NODE_ENV !== 'production',
            // Use the native built-in instead of polyfilling.
            useBuiltIns: true
          }
        ]
      ]
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
      .batch((resolve) => {
        resolve.modules.add(MODULES);
        resolve.alias.set('react-native', 'react-native-web');
      })
      .end()
    .resolveLoader
      .modules
        .add(MODULES);
};
