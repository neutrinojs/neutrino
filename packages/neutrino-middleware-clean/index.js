const CleanPlugin = require('clean-webpack-plugin');
const merge = require('deepmerge');

module.exports = (options = {}) => config => {
  const { paths, root } = merge({ paths: [], root: process.cwd() }, options);

  config
    .plugin('clean')
    .use(CleanPlugin, paths, { root });
};
