const { Server } = require('karma');
const merge = require('deepmerge');

module.exports = (config, neutrino) => {
  const defaults = {
    plugins: [
      require.resolve('karma-webpack'),
      require.resolve('karma-chrome-launcher'),
      require.resolve('karma-coverage'),
      require.resolve('karma-mocha'),
      require.resolve('karma-mocha-reporter')
    ],
    basePath: process.cwd(),
    browsers: [process.env.CI ? 'ChromeCI' : 'Chrome'],
    customLaunchers: {
      ChromeCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    frameworks: ['mocha'],
    files: ['test/**/*_test.js'],
    preprocessors: {
      'test/**/*_test.js': ['webpack'],
      'src/**/*.js': ['webpack']
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

  neutrino.on('test', ({ files, watch }) => {
    const karma = merge.all([
      defaults,
      neutrino.options.karma,
      {
        singleRun: !watch,
        autoWatch: watch,
        webpack: neutrino.getWebpackOptions()
      }
    ]);

    delete karma.webpack.plugins;

    if (files && files.length) {
      karma.files = files;
    }

    return new Promise(resolve => {
      new Server(karma, resolve).start();
    });
  });
};
