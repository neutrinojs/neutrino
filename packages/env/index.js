const { EnvironmentPlugin } = require('webpack');

module.exports = ({ config }, envs = []) => {
  let pluginOptions;

  if (Array.isArray(envs)) {
    pluginOptions = ['NODE_ENV', ...envs];
  }
  else {
    pluginOptions = [
      Object.assign({
        NODE_ENV: 'development'
      }, envs)
    ];
  }

  config
    .plugin('env')
    .use(EnvironmentPlugin, pluginOptions);
};
