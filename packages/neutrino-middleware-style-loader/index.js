module.exports = ({ config }, options = {}) => config.module
  .rule('style')
    .test(/\.css$/)
      .use('style')
        .loader(require.resolve('style-loader'))
        .when(options.style, use => use.options(options.style))
        .end()
      .use('css')
        .loader(require.resolve('css-loader'))
        .when(options.css, use => use.options(options.css));
