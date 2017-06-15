const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = (neutrino, options = {}) => neutrino.config
  .plugin('start-server')
  .use(StartServerPlugin, [{
    name: options.name,
    nodeArgs: neutrino.options.debug ? ['--inspect'] : []
  }]);
