module.exports = (neutrino, options = {}) => neutrino.config.module
  .rule('html')
  .test(neutrino.regexFromExtensions(['html']))
  .use('html')
    .loader(require.resolve('html-loader'))
    .options({
      // Override html-loader's default attrs of `['img:src']`
      // so it also parses favicon images (`<link href="...">`).
      // TODO: Remove once html-loader 1.0.0 is released:
      // https://github.com/webpack-contrib/html-loader/issues/17
      attrs: ['img:src', 'link:href'],
      ...options
    });
