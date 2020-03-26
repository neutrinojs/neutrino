const merge = require('deepmerge');
const { DuplicateRuleError } = require('neutrino/errors');

module.exports = (opts = {}) => (neutrino) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const modules = 'modules' in opts ? opts.modules : true;
  const modulesTest =
    opts.modulesTest || neutrino.regexFromExtensions(['module.css']);
  const options = merge(
    {
      test: neutrino.regexFromExtensions(['css']),
      ruleId: 'style',
      css: {
        importLoaders: opts.loaders ? opts.loaders.length : 0,
      },
      style: {},
      modules,
      modulesTest,
      loaders: [],
      extract: {
        enabled: isProduction,
        loader: {
          esModule: true,
        },
        plugin: {
          filename: isProduction
            ? 'assets/[name].[contenthash:8].css'
            : 'assets/[name].css',
        },
      },
    },
    opts,
  );

  if (neutrino.config.module.rules.has(options.ruleId)) {
    throw new DuplicateRuleError('@neutrinojs/style-loader', options.ruleId);
  }

  const extractEnabled = options.extract && options.extract.enabled;
  const rules = [
    merge(options, {
      oneOfId: 'normal',
    }),
  ];

  if (options.modules) {
    rules.unshift(
      merge(options, {
        test: options.modulesTest,
        oneOfId: 'modules',
        css: {
          modules: options.modules,
        },
      }),
    );
  }

  rules.forEach((options) => {
    const styleRule = neutrino.config.module.rule(options.ruleId);
    const loaders = [
      {
        loader: extractEnabled
          ? require.resolve('mini-css-extract-plugin/dist/loader')
          : require.resolve('style-loader'),
        options: extractEnabled ? options.extract.loader : options.style,
        useId: extractEnabled ? 'extract' : 'style',
      },
      {
        loader: require.resolve('css-loader'),
        options: options.css,
        useId: 'css',
      },
      ...options.loaders,
    ].map((loader, index) => ({
      useId: `css-${index}`,
      ...(typeof loader === 'object' ? loader : { loader }),
    }));

    loaders.forEach((loader) => {
      styleRule
        .oneOf(options.oneOfId)
        .test(options.test)
        .use(loader.useId)
        .loader(loader.loader)
        .when(loader.options, (use) => use.options(loader.options));
    });
  });

  if (extractEnabled) {
    neutrino.config
      .plugin('extract')
      .use(require.resolve('mini-css-extract-plugin'), [
        options.extract.plugin,
      ]);
  }
};
