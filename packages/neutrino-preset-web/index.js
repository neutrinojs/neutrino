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
const { join } = require('path');

const CWD = process.cwd();
const SRC = join(CWD, 'src');
const BUILD = join(CWD, 'build');
const TEST = join(CWD, 'test');
const PKG = require(join(CWD, 'package.json'));
const PROJECT_MODULES = join(CWD, 'node_modules');
const MODULES = join(__dirname, 'node_modules');

const devServer = ({ config }, options) => config.devServer
  .host(options.host)
  .port(parseInt(options.port))
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

module.exports = neutrino => {
  const { config } = neutrino;

  neutrino.use(env);
  neutrino.use(htmlLoader);
  neutrino.use(styleLoader);
  neutrino.use(fontLoader);
  neutrino.use(imageLoader);
  neutrino.use(htmlTemplate);
  neutrino.use(compileLoader, {
    include: [SRC, TEST],
    babel: {
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
    .context(CWD)
    .entry('index')
      .add(join(SRC, 'index.js'));

  config.output
    .path(BUILD)
    .publicPath('./')
    .filename('[name].bundle.js')
    .chunkFilename('[id].[chunkhash].js');

    config.resolve.modules.add(PROJECT_MODULES).add(MODULES);
    config.resolve.extensions.add('.js').add('json');
    config.resolveLoader.modules.add(PROJECT_MODULES).add(MODULES);

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
    const protocol = !!process.env.HTTPS ? 'https' : 'http';
    const host = process.env.HOST ||
      (PKG.neutrino && PKG.neutrino.config && PKG.neutrino.config.devServer && PKG.neutrino.config.devServer.host) ||
      'localhost';
    const port = process.env.PORT ||
      (PKG.neutrino && PKG.neutrino.config && PKG.neutrino.config.devServer && PKG.neutrino.config.devServer.port) ||
      5000;

    neutrino.use(hot);
    neutrino.use(devServer, {
      host,
      port,
      https: protocol === 'https',
      contentBase: SRC
    });

    config
      .devtool('eval')
      .entry('index')
        .add(`webpack-dev-server/client?${protocol}://${host}:${port}/`)
        .add('webpack/hot/dev-server');
  } else {
    neutrino.use(clean, { paths: [BUILD] });
    neutrino.use(progress);
    neutrino.use(minify);
    neutrino.use(copy, {
      patterns: [{ context: SRC, from: `**/*` }],
      options: { ignore: ['*.js*'] }
    });
    config.output.filename('[name].[chunkhash].bundle.js');
  }
};
