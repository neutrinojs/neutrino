const CleanPlugin = require('clean-webpack-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    paths: [],
    root: neutrino.options.root,
    verbose: neutrino.options.debug
  }, opts);

  const { paths } = options;
  delete options.paths;

  neutrino.config
    .plugin(opts.pluginId || 'clean')
    .use(CleanPlugin, [paths, options]);
};
