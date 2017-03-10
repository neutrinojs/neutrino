module.exports = ({ config }) => config.module
  .rule('style')
  .test(/\.css$/)
    .use('style')
      .loader(require.resolve('style-loader'))
      .end()
    .use('css')
      .loader(require.resolve('css-loader'));
