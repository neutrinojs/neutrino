const CleanPlugin = require('clean-webpack-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    pluginId: 'clean',
    paths: [],
    root: neutrino.options.root,
    verbose: neutrino.options.debug
  }, opts);
  const { paths, pluginId } = options;

  delete options.paths;
  delete options.pluginId;

  neutrino.config
    .plugin(pluginId)
      .use(CleanPlugin, [paths, options]);
};
