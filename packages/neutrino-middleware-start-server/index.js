const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = ({ config }, options) => config.plugin('start-server').use(StartServerPlugin, options.name);
