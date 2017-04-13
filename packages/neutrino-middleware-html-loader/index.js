const merge = require('deepmerge');

module.exports = ({ config }, options) => config.module
  .rule('html')
  .test(/\.html$/)
  .use('file')
    .loader(require.resolve('file-loader'))
    .options(merge({ name: '[name].[ext]' }, options));
