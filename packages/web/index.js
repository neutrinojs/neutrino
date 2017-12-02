const htmlLoader = require('@neutrinojs/html-loader');
const styleLoader = require('@neutrinojs/style-loader');
const fontLoader = require('@neutrinojs/font-loader');
const imageLoader = require('@neutrinojs/image-loader');
const compileLoader = require('@neutrinojs/compile-loader');
const env = require('@neutrinojs/env');
const hot = require('@neutrinojs/hot');
const htmlTemplate = require('@neutrinojs/html-template');
const chunk = require('@neutrinojs/chunk');
const copy = require('@neutrinojs/copy');
const clean = require('@neutrinojs/clean');
const minify = require('@neutrinojs/minify');
const loaderMerge = require('@neutrinojs/loader-merge');
const devServer = require('@neutrinojs/dev-server');
const { join, basename } = require('path');
const { resolve } = require('url');
const merge = require('deepmerge');
const ManifestPlugin = require('webpack-manifest-plugin');
const { optimize } = require('webpack');

const MODULES = join(__dirname, 'node_modules');
const NEUTRINO_MODULES = join(__dirname, '../../node_modules');

module.exports = (neutrino, opts = {}) => {
  const publicPath = './';
  const options = merge({
    publicPath,
    env: [],
    hot: true,
    hotEntries: [],
    html: {},
    polyfills: {
      async: true
    },
    devServer: {
      hot: opts.hot !== false,
      publicPath: resolve('/', publicPath)
    },
    style: {
      hot: opts.hot !== false,
      extract: (opts.style && opts.style.extract) ||
        (process.env.NODE_ENV === 'production' && {})
    },
    manifest: opts.html === false ? {} : false,
    minify: {},
    babel: {},
    targets: {},
    font: {},
    image: {}
  }, opts);

  if (typeof options.devServer.proxy === 'string') {
    options.devServer.proxy = {
      '**': {
        target: options.devServer.proxy,
        changeOrigin: true
      }
    };
  }

  if (!options.targets.node && !options.targets.browsers) {
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
    babel: compileLoader.merge({
      plugins: [
        ...(options.polyfills.async ? [[require.resolve('fast-async'), { spec: true }]] : []),
        require.resolve('babel-plugin-syntax-dynamic-import')
      ],
      presets: [
        [require.resolve('babel-preset-env'), {
          debug: neutrino.options.debug,
          modules: false,
          useBuiltIns: true,
          exclude: options.polyfills.async ? ['transform-regenerator', 'transform-async-to-generator'] : [],
          targets: options.targets
        }]
      ]
    }, options.babel)
  });

  const staticDir = join(neutrino.options.source, 'static');

  neutrino.use(env, options.env);
  neutrino.use(htmlLoader);
  neutrino.use(compileLoader, {
    include: [
      neutrino.options.source,
      neutrino.options.tests
    ],
    exclude: [staticDir],
    babel: options.babel
  });

  Object
    .keys(neutrino.options.mains)
    .forEach(key => neutrino.config.entry(key).add(neutrino.options.mains[key]));

  neutrino.config
    .when(options.style, () => neutrino.use(styleLoader, options.style))
    .when(options.font, () => neutrino.use(fontLoader, options.font))
    .when(options.image, () => neutrino.use(imageLoader, options.image))
    .target('web')
    .context(neutrino.options.root)
    .output
      .path(neutrino.options.output)
      .publicPath(options.publicPath)
      .filename('[name].js')
      .chunkFilename('[name].[chunkhash].js')
      .end()
    .resolve
      .modules
        .add('node_modules')
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .add(NEUTRINO_MODULES)
        .end()
      .extensions
        .merge(neutrino.options.extensions.map(ext => `.${ext}`))
        .end()
      .end()
    .resolveLoader
      .modules
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .add(NEUTRINO_MODULES)
        .end()
      .end()
    .node
      .set('Buffer', false)
      .set('fs', 'empty')
      .set('tls', 'empty')
      .end()
    .module
      .rule('worker')
        .test(neutrino.regexFromExtensions(neutrino.options.extensions.map(ext => `worker.${ext}`)))
        .use('worker')
          .loader(require.resolve('worker-loader'))
          .end()
        .end()
      .end()
    .when(neutrino.config.module.rules.has('lint'), () => {
      neutrino.use(loaderMerge('lint', 'eslint'), {
        envs: ['browser', 'commonjs']
      });
    })
    .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-module-eval-source-map'))
    .when(neutrino.options.command === 'start', (config) => {
      neutrino.use(devServer, options.devServer);
      config.when(options.hot, () => {
        neutrino.use(hot);
        config.when(options.hotEntries, (config) => {
          const protocol = config.devServer.get('https') ? 'https' : 'http';
          const url = `${protocol}://${config.devServer.get('public')}`;

          Object
            .keys(neutrino.options.mains)
            .forEach(key => {
              neutrino.use(htmlTemplate, merge({
                pluginId: `html-${key}`,
                filename: `${key}.html`,
                chunks: [key, 'vendor', 'runtime']
              }, options.html));

              config
                .entry(key)
                  .batch(entry => {
                    options.hotEntries.forEach(hotEntry => entry.prepend(hotEntry));
                    entry
                      .prepend(require.resolve('webpack/hot/dev-server'))
                      .prepend(`${require.resolve('webpack-dev-server/client')}?${url}`);
                  });
            });
        });
      });
    })
    .when(process.env.NODE_ENV === 'production', (config) => {
      neutrino.use(chunk);

      config
        .when(options.minify, () => neutrino.use(minify, options.minify))
        .plugin('module-concat')
          .use(optimize.ModuleConcatenationPlugin);
    })
    .when(neutrino.options.command === 'build', (config) => {
      neutrino.use(clean, { paths: [neutrino.options.output] });
      neutrino.use(copy, {
        patterns: [{
          context: staticDir,
          from: '**/*',
          to: basename(staticDir)
        }]
      });

      if (options.manifest) {
        neutrino.config.plugin('manifest')
          .use(ManifestPlugin, [options.manifest]);
      }

      config.output.filename('[name].[chunkhash].js');
    });
};
