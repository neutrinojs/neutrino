const htmlLoader = require('neutrino-middleware-html-loader');
const styleLoader = require('neutrino-middleware-style-loader');
const fontLoader = require('neutrino-middleware-font-loader');
const imageLoader = require('neutrino-middleware-image-loader');
const compileLoader = require('neutrino-middleware-compile-loader');
const env = require('neutrino-middleware-env');
const hot = require('neutrino-middleware-hot');
const htmlTemplate = require('neutrino-middleware-html-template');
const chunk = require('neutrino-middleware-chunk');
const copy = require('neutrino-middleware-copy');
const clean = require('neutrino-middleware-clean');
const minify = require('neutrino-middleware-minify');
const loaderMerge = require('neutrino-middleware-loader-merge');
const devServer = require('neutrino-middleware-dev-server');
const { join, basename } = require('path');
const merge = require('deepmerge');
const ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin');
const { optimize } = require('webpack');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    env: [],
    hot: true,
    html: {},
    devServer: {
      hot: opts.hot !== false
    },
    polyfills: {
      async: true
    },
    babel: {}
  }, opts);

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
          targets: {
            browsers: []
          }
        }]
      ]
    }, options.babel)
  });

  const staticDir = join(neutrino.options.source, 'static');
  const presetEnvOptions = options.babel.presets[0][1];

  if (!presetEnvOptions.targets.browsers.length) {
    presetEnvOptions.targets.browsers.push(
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Edge versions',
      'last 2 Opera versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    );
  }

  neutrino.use(env, options.env);
  neutrino.use(htmlLoader);
  neutrino.use(styleLoader);
  neutrino.use(fontLoader);
  neutrino.use(imageLoader);
  neutrino.use(htmlTemplate, options.html);
  neutrino.use(compileLoader, {
    include: [
      neutrino.options.source,
      neutrino.options.tests
    ],
    exclude: [staticDir],
    babel: options.babel
  });

  neutrino.config
    .target('web')
    .context(neutrino.options.root)
    .entry('index')
      .add(neutrino.options.entry)
      .end()
    .output
      .path(neutrino.options.output)
      .publicPath('./')
      .filename('[name].js')
      .chunkFilename('[name].[chunkhash].js')
      .end()
    .resolve
      .modules
        .add('node_modules')
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .end()
      .extensions
        .add('.js')
        .add('.json')
        .end()
      .end()
    .resolveLoader
      .modules
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .end()
      .end()
    .node
      .set('Buffer', false)
      .set('fs', 'empty')
      .set('tls', 'empty')
      .end()
    .plugin('script-ext')
      .use(ScriptExtHtmlPlugin, [{ defaultAttribute: 'defer' }])
      .end()
    .module
      .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker')
          .loader(require.resolve('worker-loader'))
          .end()
        .end()
      .end()
    .when(neutrino.config.module.rules.has('lint'), () => neutrino
      .use(loaderMerge('lint', 'eslint'), {
        envs: ['browser', 'commonjs']
      }))
    .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-module-eval-source-map'))
    .when(neutrino.options.command === 'start', (config) => {
      neutrino.use(devServer, options.devServer);
      config.when(options.hot, () => neutrino.use(hot));
    })
    .when(process.env.NODE_ENV === 'production', () => {
      neutrino.use(chunk);
      neutrino.use(minify);
      neutrino.config.plugin('module-concat')
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
      config.output.filename('[name].[chunkhash].js');
    });
};
