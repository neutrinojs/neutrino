const babelMerge = require('babel-merge');
const merge = require('deepmerge');
const omit = require('lodash.omit');

module.exports = neutrino => {
  const lintRule = neutrino.config.module.rules.get('lint');
  if (lintRule) {
    lintRule.use('eslint').tap(
      // Don't adjust the lint configuration for projects using their own .eslintrc.
      lintOptions => lintOptions.useEslintrc
        ? lintOptions
        : merge(lintOptions, {
            baseConfig: {
              env: {
                mocha: true
              }
            }
          })
    );
  }

  neutrino.register('mocha', (neutrino) => {
    const baseOptions = neutrino.config.module.rules.has('compile')
      ? neutrino.config.module.rule('compile').use('babel').get('options')
      : {};
    const options = omit(
      babelMerge(
        baseOptions,
        {
          extensions: neutrino.options.extensions.map(ext => `.${ext}`),
          plugins: [
            require.resolve('@babel/plugin-transform-modules-commonjs')
          ]
        }
      ),
      ['cacheDirectory']
    );

    // eslint-disable-next-line global-require
    require('@babel/register')(options);
  });
};
