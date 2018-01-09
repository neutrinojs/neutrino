const { BannerPlugin } = require('webpack');
const merge = require('deepmerge');

module.exports = (neutrino, options = {}) => {
  neutrino.config
    .plugin(options.pluginId || 'banner')
    .use(BannerPlugin, [
      merge({
        banner: 'require(\'source-map-support\').install();',
        test: neutrino.regexFromExtensions(),
        raw: true,
        entryOnly: true
      }, options)
    ]);
};
