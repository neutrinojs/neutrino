const { HotModuleReplacementPlugin } = require('webpack');

module.exports = ({ config }) => config.plugin('hot').use(HotModuleReplacementPlugin);
