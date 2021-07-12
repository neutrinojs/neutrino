module.exports =
  ({ pluginId = 'start-server', ...options } = {}) =>
  (neutrino) => {
    neutrino.config
      .plugin(pluginId)
      .use(require.resolve('start-server-nestjs-webpack-plugin'), [
        {
          name: options.name,
          nodeArgs: neutrino.options.debug ? ['--inspect'] : [],
        },
      ]);
  };
