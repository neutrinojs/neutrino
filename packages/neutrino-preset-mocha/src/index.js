const mocha = require('./mocha');
const merge = require('deepmerge');
const loaderMerge = require('neutrino-middleware-loader-merge');

module.exports = neutrino => {
  neutrino.use(loaderMerge('compile', 'babel'), {
    env: {
      test: {
        plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
      }
    }
  });

  neutrino.on('test', ({ files }) => mocha(
    merge({ reporter: 'spec', ui: 'tdd', bail: true }, neutrino.options.mocha || {}),
    neutrino.config.module.rule('compile').use('babel').get('options'),
    files
  ));
};
