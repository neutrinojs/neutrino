const { EnvironmentPlugin } = require('webpack');

module.exports = ({ config }, envs = []) => config
  .plugin('env')
  .use(EnvironmentPlugin, Array.isArray(envs) ? ['NODE_ENV', ...envs]: { 'NODE_ENV': 'development', ...envs });
