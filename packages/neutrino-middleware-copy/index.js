const CopyPlugin = require('copy-webpack-plugin');
const merge = require('deepmerge');

module.exports = (options = {}) => config => {
  const opts = merge({ patterns: [], options: {} }, options);

  config
    .plugin('copy')
    .use(CopyPlugin, opts.patterns, opts.options);
};
