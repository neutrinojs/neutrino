module.exports = () => config => config.module
  .rule('html')
  .test(/\.html$/)
  .loader('file', require.resolve('file-loader'), { name: '[name].[ext]' });
