module.exports = (neutrino, override) => (...args) => {
  if (neutrino.config.entryPoints.has('vendor')) {
    throw new Error('Vendor chunks are now automatically generated. ' +
      'Remove the manual `vendor` entrypoint.'
    );
  }

  return override(neutrino.config.toConfig(), ...args);
};
