const CopyPlugin = require('copy-webpack-plugin');
const merge = require('deepmerge');

module.exports = ({ config }, opts = {}) => {
  const { patterns, options } = merge({ patterns: [], options: {} }, opts);

  config
    .plugin(options.pluginId || 'copy')
    .use(CopyPlugin, [patterns, options]);
};
