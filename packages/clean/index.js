const CleanPlugin = require('clean-webpack-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, options = {}) => {
  const { paths, root } = merge({ paths: [], root: neutrino.options.root }, options);

  neutrino.config
    .plugin(options.pluginId || 'clean')
    .use(CleanPlugin, [paths, { root, verbose: neutrino.options.debug }]);
};
