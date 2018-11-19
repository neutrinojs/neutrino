const { ConfigurationError } = require('./errors');

const webpack = (neutrino) => {
  if (neutrino.config.entryPoints.has('vendor')) {
    throw new ConfigurationError(
      'Vendor chunks are now automatically generated. ' +
      'Remove the manual `vendor` entrypoint.'
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
