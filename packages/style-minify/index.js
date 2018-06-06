const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (neutrino, { pluginId = 'optimize-css', plugin = {} } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(OptimizeCssPlugin, [plugin]);
};
