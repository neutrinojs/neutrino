module.exports = ({ pluginId = 'optimize-css', plugin = {} } = {}) => (
  neutrino,
) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('optimize-css-assets-webpack-plugin'), [plugin]);
};
