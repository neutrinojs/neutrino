module.exports = ({ config }, options = {}) => config.module
  .rule(options.ruleId || 'style')
    .test(/\.css$/)
      .use(options.styleUseId || 'style')
        .loader(require.resolve('style-loader'))
        .when(options.style, use => use.options(options.style))
        .end()
      .use(options.cssUseId || 'css')
        .loader(require.resolve('css-loader'))
        .when(options.css, use => use.options(options.css));
