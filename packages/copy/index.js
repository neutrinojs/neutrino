module.exports = (neutrino, { pluginId = 'copy', patterns = [], options = {} } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('copy-webpack-plugin'), [
      patterns,
      {
        logLevel: neutrino.options.debug ? 'debug' : 'warn',
        ...options
      }
    ]);
};
