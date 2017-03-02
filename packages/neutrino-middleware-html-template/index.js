const HtmlPlugin = require('html-webpack-plugin');
const template = require('html-webpack-template');
const merge = require('deepmerge');

module.exports = (options = {}) => config => config
  .plugin('html')
  .use(HtmlPlugin, merge({
    template,
    inject: false,
    appMountId: 'root',
    xhtml: true,
    mobile: true,
    minify: {
      useShortDoctype: true,
      keepClosingSlash: true,
      collapseWhitespace: true,
      preserveLineBreaks: true,
    }
  }, options));
