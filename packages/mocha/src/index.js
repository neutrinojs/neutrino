const babelMerge = require('babel-merge');
const merge = require('deepmerge');
const omit = require('lodash.omit');

module.exports = (opts = {}) => (neutrino) => {
  const lintRule = neutrino.config.module.rules.get('lint');

  if (lintRule) {
    lintRule.use('eslint').tap(
      // Don't adjust the lint configuration for projects using their own .eslintrc.
      (lintOptions) =>
        lintOptions.useEslintrc
          ? lintOptions
          : merge(lintOptions, {
              baseConfig: {
                env: {
                  mocha: true,
                },
              },
            }),
    );
  }

  neutrino.register('mocha', (neutrino) => {
    const { extensions } = neutrino.options;
    const baseOptions = neutrino.config.module.rules.has('compile')
      ? neutrino.config.module.rule('compile').use('babel').get('options')
      : {};
    const babelOptions = omit(
      babelMerge(baseOptions, {
        extensions: extensions.map((ext) => `.${ext}`),
        plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
      }),
      ['cacheDirectory'],
    );

    process.env.MOCHA_BABEL_OPTIONS = JSON.stringify(babelOptions);

    return merge(
      {
        require: require.resolve('./register'),
        recursive: true,
        extension: extensions,
      },
      opts,
    );
  });
};
