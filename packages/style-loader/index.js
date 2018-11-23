const merge = require('deepmerge');
const { DuplicateRuleError } = require('neutrino/errors');

module.exports = (neutrino, opts = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const modules = 'modules' in opts ? opts.modules : true;
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
      enabled: isProduction,
      loader: {},
      plugin: {
        filename: isProduction
          ? 'assets/[name].[contenthash:8].css'
          : 'assets/[name].css'
      }
    }
  }, opts);

  if (neutrino.config.module.rules.has(options.ruleId)) {
    throw new DuplicateRuleError('@neutrinojs/style-loader', options.ruleId);
  }

  const extractEnabled = options.extract && options.extract.enabled;
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
  }

  rules.forEach(options => {
    const styleRule = neutrino.config.module.rule(options.ruleId);
    const loaders = [
      {
        loader: extractEnabled ? require.resolve('mini-css-extract-plugin/dist/loader') : require.resolve('style-loader'),
        options: extractEnabled ? options.extract.loader : options.style,
        useId: extractEnabled ? options.extractId : options.styleUseId
      },
      {
        loader: require.resolve('css-loader'),
        options: options.css,
        useId: options.cssUseId
      },
      ...options.loaders
    ]
    .map((loader, index) => ({
      useId: `${options.cssUseId}-${index}`,
      ...(typeof loader === 'object' ? loader : { loader })
    }));

    loaders.forEach(loader => {
      styleRule
        .test(options.test)
        .when(options.exclude, rule => rule.exclude.add(options.exclude))
        .use(loader.useId)
          .loader(loader.loader)
          .when(loader.options, use => use.options(loader.options));
    });
  });

  if (extractEnabled) {
    neutrino.config
      .plugin(options.extractId)
        .use(require.resolve('mini-css-extract-plugin'), [options.extract.plugin]);
  }
};
