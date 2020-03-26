module.exports = ({ pluginId = 'copy', patterns = [], options = {} } = {}) => (
  neutrino,
) => {
  neutrino.config.plugin(pluginId).use(require.resolve('copy-webpack-plugin'), [
    patterns,
    {
      logLevel: neutrino.options.debug ? 'debug' : 'warn',
      ...options,
    },
  ]);
};
