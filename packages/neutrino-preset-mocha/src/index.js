const mocha = require('./mocha');
const merge = require('deepmerge');
const { omit } = require('ramda');
const loaderMerge = require('neutrino-middleware-loader-merge');

module.exports = (neutrino, opts = {}) => {
  neutrino.on('test', ({ files }) => {
    const options = merge.all([
      { reporter: 'spec', ui: 'tdd', bail: true },
      opts,
      files.length ? { recursive: true } : {}
    ]);

    neutrino.use(loaderMerge('compile', 'babel'), {
      env: {
        test: {
          plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
        }
      }
    });

    const babelOptions = omit(
      ['cacheDirectory'],
      neutrino.config.module
        .rule('compile')
        .use('babel')
        .get('options')
    );

    return mocha(options, babelOptions, files);
  });
};
