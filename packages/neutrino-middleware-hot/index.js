const { HotModuleReplacementPlugin } = require('webpack');

module.exports = ({ config }) => config.plugin('hot', HotModuleReplacementPlugin);
