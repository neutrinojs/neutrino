const CopyPlugin = require('copy-webpack-plugin');
const merge = require('deepmerge');

module.exports = ({ config }, options) => {
  const opts = merge({ patterns: [], options: {} }, options);

  config.plugin('copy', CopyPlugin, opts.patterns, opts.options);
};
