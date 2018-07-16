module.exports = (neutrino) => {
  if (neutrino.config.entryPoints.has('vendor')) {
    throw new Error('Vendor chunks are now automatically generated. ' +
      'Remove the manual `vendor` entrypoint.'
    );
  }

  return neutrino.config.toConfig();
};
