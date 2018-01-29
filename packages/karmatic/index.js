const loaderMerge = require('@neutrinojs/loader-merge');
const karmatic = require('karmatic');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  if (neutrino.config.module.rules.has('compile')) {
    neutrino.use(loaderMerge('compile', 'babel'), {
      plugins: [require.resolve('babel-plugin-istanbul')]
    });
  }

  neutrino.on('test', ({ files, watch }) => {
    const options = merge({
      watch,
      files: files.length ? files : undefined,
      webpackConfig: neutrino.config.toConfig()
    }, opts);

    return karmatic(options);
  });
};
