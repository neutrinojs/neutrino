module.exports = (neutrino, { pluginId = 'optimize-css', plugin = {} } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('optimize-css-assets-webpack-plugin'), [plugin]);
};
