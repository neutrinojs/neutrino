const { EnvironmentPlugin } = require('webpack');

module.exports = (envs = []) => config => config
  .plugin('env')
  .use(EnvironmentPlugin, ['NODE_ENV', ...envs]);
