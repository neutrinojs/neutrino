const { BannerPlugin } = require('webpack');
const merge = require('deepmerge');

module.exports = ({ config }, options = {}) => config
  .plugin('banner')
  .use(BannerPlugin, [
    merge({
      banner: 'require(\'source-map-support\').install();',
      raw: true,
      entryOnly: true
    }, options)
  ]);
