const { HashedModuleIdsPlugin } = require('webpack');

module.exports = (neutrino, options) => neutrino.config
  .plugin('hash-ids')
  .use(HashedModuleIdsPlugin, [options]);
