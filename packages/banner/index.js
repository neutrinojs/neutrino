module.exports = (neutrino, { pluginId = 'banner', ...options } = {}) => {
  neutrino.config
    .plugin(pluginId)
    .use(require.resolve('webpack/lib/BannerPlugin'), [{
      banner: 'require(\'source-map-support\').install();',
      test: neutrino.regexFromExtensions(),
      raw: true,
      entryOnly: true,
      ...options
    }]);
};
