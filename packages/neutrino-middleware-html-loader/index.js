const merge = require('deepmerge');

module.exports = ({ config }, options = {}) => config.module
  .rule('html')
  .test(/\.html$/)
  .use('html')
    .loader(require.resolve('html-loader'))
    .options(merge({ name: '[name].[ext]' }, options));
