const { BannerPlugin } = require('webpack');

module.exports = (neutrino, options = {}) => {
  neutrino.config
    .plugin(options.pluginId || 'banner')
    .use(BannerPlugin, [{
      banner: 'require(\'source-map-support\').install();',
      test: neutrino.regexFromExtensions(),
      raw: true,
      entryOnly: true,
      ...options
    }]);
};
