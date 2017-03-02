module.exports = ({ config }) => config.module
  .rule('style')
  .test(/\.css$/)
  .loader('style', require.resolve('style-loader'))
  .loader('css', require.resolve('css-loader'));
