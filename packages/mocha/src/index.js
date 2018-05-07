const mocha = require('./mocha');
const merge = require('deepmerge');
const { omit } = require('ramda');
const loaderMerge = require('@neutrinojs/loader-merge');

module.exports = (neutrino, opts = {}) => {
  neutrino.on('test', ({ files }) => {
    const usingBabel = neutrino.config.module.rules.has('compile');
    const options = merge.all([
      { reporter: 'spec', ui: 'tdd', bail: true },
      opts,
      files && files.length ? { recursive: true } : {}
    ]);

    neutrino.config.when(usingBabel, () => {
      neutrino.use(loaderMerge('compile', 'babel'), {
        plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
      });
    });

    const babelOptions = usingBabel
      ? omit(['cacheDirectory'], neutrino.config.module.rule('compile').use('babel').get('options'))
      : {};

    return mocha(options, babelOptions, files);
  });
};
