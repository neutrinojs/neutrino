const htmlLoader = require('neutrino-middleware-html-loader');
const styleLoader = require('neutrino-middleware-style-loader');
const fontLoader = require('neutrino-middleware-font-loader');
const imageLoader = require('neutrino-middleware-image-loader');
const compileLoader = require('neutrino-middleware-compile-loader');
const env = require('neutrino-middleware-env');
const htmlTemplate = require('neutrino-middleware-html-template');
const chunk = require('neutrino-middleware-chunk');
const hot = require('neutrino-middleware-hot');
const copy = require('neutrino-middleware-copy');
const progress = require('neutrino-middleware-progress');
const clean = require('neutrino-middleware-clean');
const minify = require('neutrino-middleware-minify');
const loaderMerge = require('neutrino-middleware-loader-merge');
const namedModules = require('neutrino-middleware-named-modules');
const { join } = require('path');
const { pathOr } = require('ramda');

const MODULES = join(__dirname, 'node_modules');

function devServer({ config }, options) {
  config.devServer
    .host(options.host)
    .port(parseInt(options.port, 10))
    .https(options.https)
    .contentBase(options.contentBase)
    .historyApiFallback(true)
    .hot(true)
    .stats({
      assets: false,
      children: false,
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true,
      hash: false,
      modules: false,
      publicPath: false,
      timings: false,
      version: false,
      warnings: true
    });
}

module.exports = (neutrino) => {
  const { config } = neutrino;

  neutrino.use(env);
  neutrino.use(htmlLoader);
  neutrino.use(styleLoader);
  neutrino.use(fontLoader);
  neutrino.use(imageLoader);
  neutrino.use(htmlTemplate);
  neutrino.use(namedModules);
  neutrino.use(compileLoader, {
    include: [neutrino.options.source, neutrino.options.tests],
    babel: {
      plugins: [require.resolve('babel-plugin-syntax-dynamic-import')],
      presets: [
        [require.resolve('babel-preset-env'), {
          modules: false,
          useBuiltIns: true,
          include: ['transform-regenerator'],
          targets: {
            browsers: [
              'last 2 Chrome versions',
              'last 2 Firefox versions',
              'last 2 Edge versions',
              'last 2 Opera versions',
              'last 2 Safari versions',
              'last 2 iOS versions'
            ]
          }
        }]
      ]
    }
  });

  if (process.env.NODE_ENV !== 'test') {
    neutrino.use(chunk);
  }

  config
    .target('web')
    .context(neutrino.options.root)
    .entry('index')
      .add(require.resolve('babel-polyfill'))
      .add(neutrino.options.entry);

  config.output
    .path(neutrino.options.output)
    .publicPath('./')
    .filename('[name].bundle.js')
    .chunkFilename('[id].[chunkhash].js');

  config.resolve.modules.add(neutrino.options.node_modules).add(MODULES);
  config.resolve.extensions.add('.js').add('.json');
  config.resolveLoader.modules.add(neutrino.options.node_modules).add(MODULES);

  config.node
    .set('console', false)
    .set('global', true)
    .set('process', true)
    .set('Buffer', true)
    .set('__filename', 'mock')
    .set('__dirname', 'mock')
    .set('setImmediate', true)
    .set('fs', 'empty')
    .set('tls', 'empty');

  if (config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      globals: ['Buffer'],
      envs: ['browser', 'commonjs']
    });
  }

  if (process.env.NODE_ENV === 'development') {
    const protocol = process.env.HTTPS ? 'https' : 'http';
    const host = process.env.HOST || pathOr('localhost', ['options', 'config', 'devServer', 'host'], neutrino);
    const port = process.env.PORT || pathOr(5000, ['options', 'config', 'devServer', 'port'], neutrino);

    neutrino.use(hot);
    neutrino.use(devServer, {
      host,
      port,
      https: pathOr(protocol === 'https', ['options', 'config', 'devServer', 'https'], neutrino),
      contentBase: neutrino.options.source
    });

    config
      .devtool('source-map')
      .entry('index')
        .add(`webpack-dev-server/client?${protocol}://${host}:${port}/`)
        .add('webpack/hot/dev-server');
  } else {
    neutrino.use(clean, { paths: [neutrino.options.output] });
    neutrino.use(progress);
    neutrino.use(minify);
    neutrino.use(copy, {
      patterns: [{ context: neutrino.options.source, from: '**/*' }],
      options: { ignore: ['*.js*'] }
    });
    config.output.filename('[name].[chunkhash].bundle.js');
  }
};
