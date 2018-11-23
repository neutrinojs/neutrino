const web = require('@neutrinojs/web');
const babelMerge = require('babel-merge');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    hot: true,
    babel: {}
  }, opts);
  let reactHotLoader = false;

  try {
    // Attempt to load react-hot-loader from the user's installation.
    reactHotLoader = require.resolve('react-hot-loader/babel');
  } catch (err) {} // eslint-disable-line no-empty

  Object.assign(options, {
    babel: babelMerge({
      plugins: [
        // The RHL plugin is enabled in production too since it removes the `hot(module)(...)`
        // wrapper, allowing webpack to use its concatenate modules optimization.
        options.hot && reactHotLoader,
        process.env.NODE_ENV === 'production' && [
          require.resolve('babel-plugin-transform-react-remove-prop-types'),
          {
            removeImport: true
          }
        ],
        // Using loose for the reasons here:
        // https://github.com/facebook/create-react-app/issues/4263
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
      ].filter(Boolean),
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

  const lintRule = neutrino.config.module.rules.get('lint');
  if (lintRule) {
    lintRule.use('eslint').tap(
      // Don't adjust the lint configuration for projects using their own .eslintrc.
      lintOptions => lintOptions.useEslintrc
        ? lintOptions
        : merge(lintOptions, {
            baseConfig: {
              plugins: ['react'],
              settings: {
                react: {
                  // https://github.com/yannickcr/eslint-plugin-react#configuration
                  // This is undocumented, but equivalent to "latest version".
                  version: '999.999.999'
                }
              }
            }
          })
    );
  }

  neutrino.config.resolve
    .alias
      .set('react-native', 'react-native-web')
      .end()
    .extensions
      .prepend('.web.js')
      .prepend('.web.jsx');
};
