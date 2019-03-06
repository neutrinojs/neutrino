module.exports = (neutrino, { pluginId = 'clean', ...opts } = {}) => {
  const options = {
    verbose: neutrino.options.debug,
    ...opts
  };

  neutrino.config
    .plugin(pluginId)
      .use(require.resolve('clean-webpack-plugin'), [options]);
};
