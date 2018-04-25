const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const modules = opts.modules || true;
  const modulesTest = opts.modulesTest || neutrino.regexFromExtensions(['module.css']);
  const options = merge({
    test: neutrino.regexFromExtensions(['css']),
    ruleId: 'style',
    styleUseId: 'style',
    cssUseId: 'css',
    css: {
      importLoaders: opts.loaders ? opts.loaders.length : 0
    },
    style: {},
    modules,
    modulesTest,
    modulesSuffix: '-modules',
    exclude: modules && modulesTest,
    loaders: [],
    extractId: 'extract',
    extract: {
      loader: {},
      plugin: {
        filename: neutrino.options.command === 'build' ? '[name].[contenthash].css' : '[name].css'
      }
    }
  }, opts);

  const rules = [options];

  if (options.modules) {
    rules.push(
      merge(options, {
        test: options.modulesTest,
        exclude: options.modulesExclude,
        ruleId: `${options.ruleId}${options.modulesSuffix}`,
        styleUseId: `${options.styleUseId}${options.modulesSuffix}`,
        cssUseId: `${options.cssUseId}${options.modulesSuffix}`,
        extractId: `${options.extractId}${options.modulesSuffix}`,
        css: {
          modules: options.modules
        }
      })
    );
  };

  rules.forEach(options => {
    const styleRule = neutrino.config.module.rule(options.ruleId);
    const loaders = [
      {
        loader: options.extract ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
        options: options.extract ? options.extract.loader : options.style,
        useId: options.extract ? options.extractId : options.styleUseId
      },
      {
        loader: require.resolve('css-loader'),
        options: options.css,
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
        .when(options.exclude, rule => rule.exclude.add(options.exclude))
        .use(loader.useId)
          .loader(loader.loader)
          .when(loader.options, use => use.options(loader.options));
    });
  });

  if (options.extract) {
    neutrino.config
      .plugin(options.extractId)
        .use(MiniCssExtractPlugin, [options.extract.plugin]);
  }
};
