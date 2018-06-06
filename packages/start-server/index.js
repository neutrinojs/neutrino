const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = (neutrino, { pluginId = 'start-server', ...options } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(StartServerPlugin, [{
      name: options.name,
      nodeArgs: neutrino.options.debug ? ['--inspect'] : []
    }]);
};
