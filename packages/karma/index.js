const babelMerge = require('babel-merge');
const merge = require('deepmerge');
const omit = require('lodash.omit');
const { join } = require('path');

module.exports = (options = {}) => (neutrino) => {
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

  neutrino.register('karma', (neutrino) => (config) => {
    if (neutrino.config.module.rules.has('compile')) {
      neutrino.config.module
        .rule('compile')
        .use('babel')
        .tap((options) =>
          babelMerge(options, {
            plugins: [require.resolve('babel-plugin-istanbul')],
          }),
        );
    }

    const tests = join(neutrino.options.tests, '**/*_test.js');
    const sources = join(neutrino.options.source, '**/*.js*');

    config.set(
      merge(
        {
          basePath: neutrino.options.root,
          browsers: [process.env.CI ? 'ChromeCI' : 'ChromeHeadless'],
          customLaunchers: {
            ChromeCI: {
              base: 'ChromeHeadless',
              flags: ['--no-sandbox'],
            },
          },
          frameworks: ['mocha'],
          files: [
            {
              pattern: tests,
              watched: false,
              included: true,
              served: true,
            },
          ],
          plugins: [
            require.resolve('karma-webpack'),
            require.resolve('karma-chrome-launcher'),
            require.resolve('karma-coverage'),
            require.resolve('karma-mocha'),
            require.resolve('karma-mocha-reporter'),
          ],
          preprocessors: {
            [tests]: ['webpack'],
            [sources]: ['webpack'],
          },
          webpackMiddleware: {
            // Only display webpack compile duration and errors/warnings, since
            // the focus should be on the output from the tests/karma instead.
            stats: {
              all: false,
              errors: true,
              timings: true,
              warnings: true,
            },
          },
          webpack: omit(neutrino.config.toConfig(), ['entry']),
          reporters: ['mocha', 'coverage'],
          coverageReporter: {
            dir: '.coverage',
            reporters: [
              { type: 'html', subdir: 'report-html' },
              { type: 'lcov', subdir: 'report-lcov' },
            ],
          },
        },
        options,
      ),
    );

    return config;
  });
};
