const webpack = (neutrino) => {
  if (neutrino.config.entryPoints.has('vendor')) {
    throw new Error(
      'Vendor chunks are now automatically generated. ' +
      'Remove the manual `vendor` entrypoint.'
    );
  }

  const devtool = neutrino.config.get('devtool');
  const usingSourcemap = typeof devtool === 'string' && /source-?map/.test(devtool);
  const minimizer = neutrino.config.optimization.minimizers.get('terser');
  // Catch cases where the user is configuring sourcemaps outside of the web preset,
  // since it prevents the correct configuration of `terser-webpack-plugin`. eg:
  //   module.exports = {
  //     use: [
  //       '@neutrinojs/web',
  //       (neutrino) => neutrino.config.devtool('source-map'),
  //     ]
  //   };
  // This cannot occur when using the node or library presets, since they unconditionally
  // set sourceMap to `true`. If a project wants to configure neutrino.config.devtool but
  // disable source maps in terser-webpack-plugin, then they can unset `sourceMap` rather
  // than setting it to `false`.
  if (usingSourcemap && minimizer && (minimizer.get('args')[0] || {}).sourceMap === false) {
    throw new Error(
      `neutrino.config.devtool is set to '${devtool}', however terser-webpack-plugin ` +
      'has not been correctly configured to allow source maps. ' +
      'This can happen if the devtool is configured manually outside of the preset. ' +
      'Use the web/react/vue/... preset\'s new `devtool` option instead. See:\n' +
      'https://neutrinojs.org/packages/web/#source-maps'
    );
  }

  return neutrino.config.toConfig();
};

const inspect = (neutrino) => {
  const stringifiedConfig = neutrino.config.toString({
    configPrefix: 'neutrino.config',
    verbose: true
  });
  console.log(stringifiedConfig);
};

module.exports = {
  webpack,
  inspect
};
