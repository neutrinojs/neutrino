module.exports = ({ pluginId = 'clean', ...opts } = {}) => (neutrino) => {
  const options = {
    verbose: neutrino.options.debug,
    ...opts,
  };

  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('clean-webpack-plugin'), [options])
    .init((Plugin, args) => new Plugin.CleanWebpackPlugin(...args));
};
