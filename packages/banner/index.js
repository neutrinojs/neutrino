const { BannerPlugin } = require('webpack');

module.exports = (neutrino, { pluginId = 'banner', ...options } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(BannerPlugin, [{
      banner: 'require(\'source-map-support\').install();',
      test: neutrino.regexFromExtensions(),
      raw: true,
      entryOnly: true,
      ...options
    }]);
};
