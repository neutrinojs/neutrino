module.exports = ({ config }) => config.module
  .rule('html')
  .test(/\.html$/)
  .use('file')
    .loader(require.resolve('file-loader'))
    .options({ name: '[name].[ext]' });
