module.exports = (neutrino, { pluginId = 'start-server', ...options } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('start-server-webpack-plugin'), [{
      name: options.name,
      nodeArgs: neutrino.options.debug ? ['--inspect'] : []
    }]);
};
