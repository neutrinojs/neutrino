const { EnvironmentPlugin } = require('webpack');

module.exports = ({ config }, envs = []) => config.plugin('env', EnvironmentPlugin,
  ['NODE_ENV', ...(Array.isArray(envs) ? envs : [])]);
