const BabiliPlugin = require('babili-webpack-plugin');

module.exports = ({ config }) => config.plugin('minify').use(BabiliPlugin);
