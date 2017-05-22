const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = (neutrino, options) => {
  if (neutrino.options.args && neutrino.options.args.debug) {
    // start server with --inspect
    return neutrino.config.plugin('start-server').use(StartServerPlugin, [{
      name: options.name,
      nodeArgs: ['--inspect']
    }]);
  }
  // normal start-server
  return neutrino.config.plugin('start-server').use(StartServerPlugin, [options.name]);
};
