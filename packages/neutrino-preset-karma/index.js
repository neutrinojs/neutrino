const { Server } = require('karma');
const merge = require('deepmerge');
const { join } = require('path');
const { omit } = require('ramda');
const loaderMerge = require('neutrino-middleware-loader-merge');

module.exports = (neutrino, opts = {}) => {
  const tests = join(neutrino.options.tests, '**/*_test.js');
  const sources = join(neutrino.options.source, '**/*.js*');
  const defaults = {
    plugins: [
      require.resolve('karma-webpack'),
      require.resolve('karma-chrome-launcher'),
      require.resolve('karma-coverage'),
      require.resolve('karma-mocha'),
      require.resolve('karma-mocha-reporter')
    ],
    basePath: neutrino.options.root,
    browsers: [process.env.CI ? 'ChromeCI' : 'Chrome'],
    customLaunchers: {
      ChromeCI: {
        base: 'Chrome',
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
    preprocessors: {
      [tests]: ['webpack'],
      [sources]: ['webpack']
    },
    webpackMiddleware: { noInfo: true },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: '.coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    }
  };

  if (neutrino.config.module.rules.has('compile')) {
    neutrino.use(loaderMerge('compile', 'babel'), {
      env: {
        test: {
          plugins: [require.resolve('babel-plugin-istanbul')]
        }
      }
    });
  }

  neutrino.on('test', ({ files, watch }) => new Promise((resolve, reject) =>
    new Server(merge.all([
      opts.override ? opts : merge(defaults, opts),
      { singleRun: !watch, autoWatch: watch, webpack: omit(['plugins'], neutrino.config.toConfig()) },
      files && files.length ? { files } : {}
    ]), exitCode => (exitCode !== 0 ? reject() : resolve()))
    .start()
  ));
};
