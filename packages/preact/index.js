const babelMerge = require('babel-merge');
const web = require('@neutrinojs/web');
const merge = require('deepmerge');

module.exports = (opts = {}) => (neutrino) => {
  const options = {
    hot: true,
    ...opts,
    babel: babelMerge({
      plugins: [
        [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }],
        // Using loose for the reasons here:
        // https://github.com/facebook/create-react-app/issues/4263
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
      ]
    }, opts.babel || {})
  };

  neutrino.use(web(options));

  neutrino.config
    .resolve
      .alias
        .set('react', 'preact-compat')
        .set('react-dom', 'preact-compat')
        .set('create-react-class', 'preact-compat/lib/create-react-class')
        .set('react-addons-css-transition-group', 'preact-css-transition-group');

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
                  pragma: 'h'
                }
              }
            }
          })
    );
  }
};
