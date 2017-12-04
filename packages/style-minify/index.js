const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = ({ config }, options = {}) => {
  config
    .plugin('style-minify')
    .use(OptimizeCssPlugin, [options]);
}
