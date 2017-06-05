const { EnvironmentPlugin } = require('webpack');

module.exports = ({ config }, envs = []) => config
  .plugin('env')
  .use(EnvironmentPlugin, ['NODE_ENV', ...envs]);
