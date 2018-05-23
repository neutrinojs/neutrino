const loaderMerge = require('@neutrinojs/loader-merge');
const merge = require('babel-merge');
const omit = require('lodash.omit');

module.exports = neutrino => {
  if (neutrino.config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      envs: ['mocha']
    });
  }

  neutrino.register('mocha', (neutrino, override) => {
    const baseOptions = neutrino.config.module.rules.has('compile')
      ? neutrino.config.module.rule('compile').use('babel').get('options')
      : {};
    const options = omit(
      merge(
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
    require('@babel/register')(override(options));
  });
};
