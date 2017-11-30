const merge = require('deepmerge');

module.exports = (neutrino, options = {}) => neutrino.config.module
  .rule('html')
  .test(neutrino.regexFromExtensions(['html']))
  .use('html')
    .loader(require.resolve('html-loader'))
    .options(merge({ name: '[name].[ext]' }, options));
