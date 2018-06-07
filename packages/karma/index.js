const { merge: babelMerge } = require('@neutrinojs/compile-loader');
const loaderMerge = require('@neutrinojs/loader-merge');
const merge = require('deepmerge');
const omit = require('lodash.omit');
const { join } = require('path');

module.exports = neutrino => {
  if (neutrino.config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      envs: ['mocha']
    });
  }

  neutrino.register('karma', (neutrino, override) => config => {
    if (neutrino.config.module.rules.has('compile')) {
      neutrino.config.module
        .rule('compile')
        .use('babel')
        .tap(options => babelMerge(options, {
          plugins: [require.resolve('babel-plugin-istanbul')]
        }));
    }

    const tests = join(neutrino.options.tests, '**/*_test.js');
    const sources = join(neutrino.options.source, '**/*.js*');

    config.set({
      basePath: neutrino.options.root,
      browsers: [process.env.CI ? 'ChromeCI' : 'ChromeHeadless'],
      customLaunchers: {
        ChromeCI: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox']
        }
      },
      frameworks: ['mocha'],
      files: [{
        pattern: tests,
        watched: false,
        included: true,
        served: true
      }],
      plugins: [
        require.resolve('karma-webpack'),
        require.resolve('karma-chrome-launcher'),
        require.resolve('karma-coverage'),
        require.resolve('karma-mocha'),
        require.resolve('karma-mocha-reporter')
      ],
      preprocessors: {
        [tests]: ['webpack'],
        [sources]: ['webpack']
      },
      webpackMiddleware: {
        stats: 'errors-only'
      },
      webpack: merge(
        omit(neutrino.config.toConfig(), ['plugins', 'entry']),
        // Work around `yarn test` hanging under webpack 4:
        // https://github.com/webpack-contrib/karma-webpack/issues/322
        {
          optimization: {
            splitChunks: false,
            runtimeChunk: false
          }
        }
      ),
      reporters: ['mocha', 'coverage'],
      coverageReporter: {
        dir: '.coverage',
        reporters: [
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' }
        ]
      }
    });

    return override(config);
  });
};
