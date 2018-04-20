const BabelMinifyPlugin = require('@neutrinojs/babel-minify-webpack-plugin');

module.exports = ({ config }, options = {}) => config
  .optimization
    // Replaces the default of UglifyJsPlugin.
    .minimizer([
      new BabelMinifyPlugin(options.minify, options.plugin)
    ]);
