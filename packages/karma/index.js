const { Server, constants: { LOG_DEBUG, LOG_INFO } } = require('karma');
const merge = require('deepmerge');
const { join } = require('path');
const { omit } = require('ramda');
const loaderMerge = require('@neutrinojs/loader-merge');

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
    logLevel: neutrino.options.debug ? LOG_DEBUG : LOG_INFO,
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
      plugins: [require.resolve('babel-plugin-istanbul')]
    });
  }

  neutrino.on('test', ({ files, watch }) => new Promise((resolve, reject) => {
    const karmaOptions = merge.all([
      opts.override ? opts : merge(defaults, opts),
      {
        singleRun: !watch,
        autoWatch: watch,
        webpack: omit(['plugins'], neutrino.config.toConfig())
      },
      files && files.length ? { files } : {}
    ]);

    const server = new Server(karmaOptions, exitCode => (exitCode !== 0 ? reject() : resolve()));

    return server.start();
  }));
};
