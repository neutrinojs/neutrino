const htmlLoader = require('@neutrinojs/html-loader');
const styleLoader = require('@neutrinojs/style-loader');
const fontLoader = require('@neutrinojs/font-loader');
const imageLoader = require('@neutrinojs/image-loader');
const compileLoader = require('@neutrinojs/compile-loader');
const htmlTemplate = require('@neutrinojs/html-template');
const clean = require('@neutrinojs/clean');
const loaderMerge = require('@neutrinojs/loader-merge');
const devServer = require('@neutrinojs/dev-server');
const { resolve } = require('url');
const merge = require('deepmerge');
const { ConfigurationError } = require('neutrino/errors');

module.exports = (neutrino, opts = {}) => {
  if (neutrino.config.module.rules.has('compile')) {
    throw new ConfigurationError(
      '@neutrinojs/web is being used when a `compile` rule already exists, ' +
      'which would overwrite the existing configuration. If you are including ' +
      'this preset manually to customise rules configured by another preset, ' +
      "instead use that preset's own options to do so."
    );
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const publicPath = opts.publicPath || './';
  const options = merge({
    publicPath,
    env: false,
    hot: true,
    html: {},
    devtool: {
      development: 'cheap-module-eval-source-map',
      production: undefined,
      test: 'source-map'
    },
    devServer: {
      hot: opts.hot !== false,
      publicPath: resolve('/', publicPath)
    },
    style: {
      hot: opts.hot !== false,
      extract: isProduction
    },
    manifest: opts.html === false ? {} : false,
    clean: opts.clean !== false && {
      paths: [neutrino.options.output]
    },
    minify: {
      source: isProduction
    },
    babel: {},
    targets: {},
    font: {},
    image: {}
  }, opts);

  if ('babel' in options.minify) {
    throw new ConfigurationError(
      'The minify.babel option has been removed. See the web preset docs for how to customise source minification.'
    );
  }

  if ('image' in options.minify) {
    throw new ConfigurationError(
      'The minify.image option has been removed. See: https://github.com/neutrinojs/neutrino/issues/1104'
    );
  }

  if ('style' in options.minify) {
    throw new ConfigurationError(
      'The minify.style option has been removed. To enable style minification use the @neutrinojs/style-minify preset.'
    );
  }

  if ('polyfills' in options) {
    throw new ConfigurationError(
      'The polyfills option has been removed, since polyfills are no longer included by default.'
    );
  }

  if ('hotEntries' in options) {
    throw new ConfigurationError(
      'The hotEntries option has been removed. See the "neutrino.options.mains" ' +
      'docs for how to add custom hot entries to your bundle without importing.'
    );
  }

  if (typeof options.devtool === 'string' || typeof options.devtool === 'boolean') {
    options.devtool = {
      development: options.devtool,
      production: options.devtool,
      test: options.devtool
    };
  }

  if (typeof options.devServer.proxy === 'string') {
    options.devServer.proxy = {
      '**': {
        target: options.devServer.proxy,
        changeOrigin: true,
        headers: {
          Forwarded: 'by=_webpack-dev-server'
        }
      }
    };
  }

  // Force @babel/preset-env default behavior (.browserslistrc)
  if (options.targets === false) {
    options.targets = {};
  } else if (!options.targets.node && !options.targets.browsers) {
    options.targets.browsers = [
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Edge versions',
      'last 2 Opera versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    ];
  }

  Object.assign(options, {
    style: options.style && merge(options.style, {
      extract: options.style.extract === true ? {} : options.style.extract
    }),
    babel: compileLoader.merge({
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import')
      ],
      presets: [
        [require.resolve('@babel/preset-env'), {
          debug: neutrino.options.debug,
          useBuiltIns: 'entry',
          targets: options.targets
        }]
      ]
    }, options.babel)
  });

  if (options.env) {
    neutrino.config.plugin('env')
      .use(require.resolve('webpack/lib/EnvironmentPlugin'), [options.env]);
  }

  const devtool = options.devtool[process.env.NODE_ENV];

  if (devtool !== undefined) {
    neutrino.config.devtool(devtool);
  }

  neutrino.use(htmlLoader);
  neutrino.use(compileLoader, {
    include: [
      neutrino.options.source,
      neutrino.options.tests
    ],
    babel: options.babel
  });

  Object
    .entries(neutrino.options.mains)
    .forEach(([name, config]) => {
      const { entry, ...htmlTemplateConfig } = config;
      neutrino.config.entry(name).add(entry);

      if (options.html) {
        neutrino.use(htmlTemplate, merge.all([
          {
            pluginId: `html-${name}`,
            filename: `${name}.html`,
            chunks: [name]
          },
          options.html,
          htmlTemplateConfig
        ]));
      }
    });

  const jsFilename = isProduction ? '[name].[contenthash:8].js' : '[name].js';

  neutrino.config
    .optimization
      .minimize(options.minify.source)
      // Use terser instead of the unmaintained uglify-es.
      // This is a backport of the upcoming webpack 5 minimizer configuration:
      // https://github.com/edmorley/webpack/blob/a94d0434a99489ef9bcb1808cdbe9cbe97bbd3e7/lib/WebpackOptionsDefaulter.js#L292-L308
      .when(options.minify.source, (optimization) =>
        optimization
          .minimizer('terser')
          .use(require.resolve('terser-webpack-plugin'), [{
            cache: true,
            parallel: true,
            sourceMap: typeof devtool === 'string' && /source-?map/.test(devtool)
          }])
       )
      .splitChunks({
        // By default SplitChunksPlugin only splits out the async chunks (to avoid the
        // ever-changing file list breaking users who don't auto-generate their HTML):
        // https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks-chunks-all
        // https://github.com/webpack/webpack/issues/7064
        chunks: 'all',
        // Override the default limit of 3 chunks per entrypoint in production, since
        // it speeds up builds and the greater number of requests is mitigated by use
        // of long term caching (and a non-issue if using HTTP2).
        maxInitialRequests: isProduction ? 5 : Infinity,
        // By default the generated files use names that reference the chunk names, eg:
        // `vendors~index~page2.b694ee99.js`. Setting to `false` causes them to use the
        // chunk ID instead (eg `1.ceddedc0.js`), which prevents cache-busting when a
        // new page is added with the same shared vendor dependencies.
        name: !isProduction
      })
      // Create a separate chunk for the webpack runtime, so it can be cached separately
      // from the more frequently-changing entrypoint chunks.
      .runtimeChunk('single')
      .end()
    .when(options.style, () => neutrino.use(styleLoader, options.style))
    .when(options.font, () => neutrino.use(fontLoader, options.font))
    .when(options.image, () => neutrino.use(imageLoader, options.image))
    .target('web')
    .context(neutrino.options.root)
    .output
      .path(neutrino.options.output)
      .publicPath(options.publicPath)
      .filename(jsFilename)
      .chunkFilename(jsFilename)
      .end()
    .resolve
      .extensions
        .merge(neutrino.options.extensions.concat('json').map(ext => `.${ext}`))
        .end()
      .end()
    .node
      .set('Buffer', false)
      .set('fs', 'empty')
      .set('tls', 'empty')
      .end()
    // The default output is too noisy, particularly with multiple entrypoints.
    .stats({
      children: false,
      entrypoints: false,
      modules: false
    })
    .when(neutrino.config.module.rules.has('lint'), () => {
      neutrino.use(loaderMerge('lint', 'eslint'), {
        envs: ['browser', 'commonjs']
      });
    })
    .when(process.env.NODE_ENV === 'development', config => {
      neutrino.use(devServer, options.devServer);
      config.when(options.hot, (config) => {
        config.plugin('hot').use(require.resolve('webpack/lib/HotModuleReplacementPlugin'));
      });
    })
    .when(isProduction, (config) => {
      config.when(options.clean, () => neutrino.use(clean, options.clean));

      if (options.manifest) {
        neutrino.config.plugin('manifest')
          .use(require.resolve('webpack-manifest-plugin'), [options.manifest]);
      }
    });
};
