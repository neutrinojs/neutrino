module.exports = (neutrino, { pluginId = 'copy', patterns = [], options = {} } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('copy-webpack-plugin'), [
      patterns,
      {
        debug: neutrino.options.debug,
        ...options
      }
    ]);
};
