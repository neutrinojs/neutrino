const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const cssTest = neutrino.regexFromExtensions(['css']);
  const cssModulesTest = neutrino.regexFromExtensions(['module.css']);

  const options = merge({
    test: (input) => {
      const isCssModule = cssModulesTest.test(input);
      const isRegularCss = cssTest.test(input);

      if (opts.modules !== false && isCssModule) {
        return false;
      }

      return isRegularCss;
    },
    ruleId: 'style',
    styleUseId: 'style',
    cssUseId: 'css',
    css: { importLoaders: 0 },
    style: {},
    hot: true,
    hotUseId: 'hot',
    modules: true,
    modulesSuffix: '-modules',
    modulesTest: cssModulesTest,
    loaders: [],
    extractId: 'extract',
    extract: {
      plugin: {
        filename: neutrino.options.command === 'build' ? '[name].[contenthash].css' : '[name].css',
        ignoreOrder: opts.modules !== false,
        allChunks: true
      }
    }
  }, opts);

  const rules = [options];

  if (options.modules) {
    rules.push(merge(options, {
      test: options.modulesTest,
      ruleId: `${options.ruleId}${options.modulesSuffix}`,
      styleUseId: `${options.styleUseId}${options.modulesSuffix}`,
      cssUseId: `${options.cssUseId}${options.modulesSuffix}`,
      hotUseId: `${options.hotUseId}${options.modulesSuffix}`,
      extractId: `${options.extractId}${options.modulesSuffix}`,
      css: {
        modules: options.modules,
        importLoaders: 1
      }
    }));
  }

  rules.forEach(options => {
    const styleRule = neutrino.config.module.rule(options.ruleId);
    const loaders = [
      {
        loader: require.resolve('style-loader'),
        options: options.style,
        useId: options.styleUseId
      },
      {
        loader: require.resolve('css-loader'),
        options: Object.assign(options.css, {
          importLoaders: options.css.importLoaders + options.loaders.length
        }),
        useId: options.cssUseId
      },
      ...options.loaders
    ]
    .map((loader, index) => {
      const obj = typeof loader === 'object' ? loader : { loader };

      return Object.assign(obj, {
        useId: obj.useId || `${options.cssUseId}-${index}`
      });
    });

    loaders.forEach(loader => {
      styleRule
        .test(options.test)
        .use(loader.useId)
          .loader(loader.loader)
          .when(loader.options, use => use.options(loader.options));
    });

    if (options.extract) {
      const styleEntries = styleRule.uses.entries();
      const useIds = Object.keys(styleEntries).filter(key => key !== options.styleUseId);
      const extractLoader = Object.assign({
        use: useIds.map(key => ({
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
          rule.use(options.hotUseId)
            .loader(require.resolve('css-hot-loader'))
            .when(options.hot !== true, use => use.options(options.hot));
        });

      ExtractTextPlugin
        .extract(extractLoader)
        .forEach(({ loader, options }) => {
          styleRule
            .use(loader)
              .loader(loader)
              .options(options);
        });

      neutrino.config
        .plugin(options.extractId)
          .use(ExtractTextPlugin, [options.extract.plugin]);
    }
  });

};
