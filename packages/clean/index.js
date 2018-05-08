const CleanPlugin = require('clean-webpack-plugin');

module.exports = (neutrino, opts = {}) => {
  const options = {
    pluginId: 'clean',
    paths: [],
    root: neutrino.options.root,
    verbose: neutrino.options.debug,
    ...opts
  };
  const { paths, pluginId } = options;

  delete options.paths;
  delete options.pluginId;

  neutrino.config
    .plugin(pluginId)
      .use(CleanPlugin, [paths, options]);
};
