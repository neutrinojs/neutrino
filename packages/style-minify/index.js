const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = ({ config }, options = {
  pluginUseId: 'style-minify',
  plugin: {}
}) => {
  config
    .plugin(options.pluginUseId)
    .use(OptimizeCssPlugin, [options.plugin]);
}
