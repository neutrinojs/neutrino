const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = () => config => config.plugin('progress').use(ProgressBarPlugin);
