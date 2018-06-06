const CleanPlugin = require('clean-webpack-plugin');

module.exports = (neutrino, { pluginId = 'clean', paths = [], ...opts } = {}) => {
  const options = {
    root: neutrino.options.root,
    verbose: neutrino.options.debug,
    ...opts
  };

  neutrino.config
    .plugin(pluginId)
      .use(CleanPlugin, [paths, options]);
};
