const CopyPlugin = require('copy-webpack-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const { patterns, options } = merge({
    patterns: [],
    options: { debug: neutrino.options.debug }
  }, opts);

  neutrino.config
    .plugin(options.pluginId || 'copy')
    .use(CopyPlugin, [patterns, options]);
};
