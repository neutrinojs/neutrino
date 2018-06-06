const CopyPlugin = require('copy-webpack-plugin');

module.exports = (neutrino, { pluginId = 'copy', patterns = [], options = {} } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(CopyPlugin, [
      patterns,
      {
        debug: neutrino.options.debug,
        ...options
      }
    ]);
};
