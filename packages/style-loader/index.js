const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    styleUseId: 'style',
    hot: true,
    extract: {
      plugin: {
        filename: neutrino.options.command === 'build' ? '[name].[contenthash].css' : '[name].css'
      }
    }
  }, opts);

  neutrino.config.module
    .rule(options.ruleId || 'style')
      .test(neutrino.regexFromExtensions(['css']))
      .use(options.styleUseId)
         .loader(require.resolve('style-loader'))
         .when(options.style, use => use.options(options.style))
         .end()
      .use(options.cssUseId || 'css')
        .loader(require.resolve('css-loader'))
        .when(options.css, use => use.options(options.css));

  if (options.extract) {
    const styleRule = neutrino.config.module.rule('style');
    const styleEntries = styleRule.uses.entries();
    const useKeys = Object.keys(styleEntries).filter(key => key !== options.styleUseId);

    options.extract.loader = Object.assign({
      use: useKeys.map(key => ({
        loader: styleEntries[key].get('loader'),
        options: styleEntries[key].get('options')
      })),
      fallback: {
        loader: styleEntries[options.styleUseId].get('loader'),
        options: styleEntries[options.styleUseId].get('options')
      }
    }, options.extract.loader || {});

    styleRule
      .uses
        .clear()
        .end()
      .when(options.hot, (rule) => {
        rule.use(options.hotUseId || 'hot')
          .loader(require.resolve('css-hot-loader'))
          .when(options.hot !== true, use => use.options(options.hot));
      });

    ExtractTextPlugin
      .extract(options.extract.loader)
      .forEach(({ loader, options }) => {
        styleRule
          .use(loader)
            .loader(loader)
            .options(options);
      });

    neutrino.config
      .plugin('extract')
        .use(ExtractTextPlugin, [options.extract.plugin]);
  }
};
