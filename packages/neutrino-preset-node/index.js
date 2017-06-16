const banner = require('neutrino-middleware-banner');
const compile = require('neutrino-middleware-compile-loader');
const copy = require('neutrino-middleware-copy');
const clean = require('neutrino-middleware-clean');
const startServer = require('neutrino-middleware-start-server');
const hot = require('neutrino-middleware-hot');
const nodeExternals = require('webpack-node-externals');
const { basename, join, parse, format } = require('path');
const merge = require('deepmerge');
const { omit, partialRight, pathOr, pipe } = require('ramda');

const MODULES = join(__dirname, 'node_modules');
const getPackageJson = (root) => {
  try {
    return require(join(root, 'package.json')); // eslint-disable-line
  } catch (err) {
    return {};
  }
};
const getOutputForEntry = pipe(
  parse,
  omit(['base']),
  partialRight(merge, [{ ext: '.js' }]),
  format,
  basename
);

module.exports = (neutrino, opts = {}) => {
  const pkg = getPackageJson(neutrino.options.root);
  const sourceMap = pathOr(
    pathOr(false, ['dependencies', 'source-map-support'], pkg),
    ['devDependencies', 'source-map-support'],
    pkg
  );
  const options = merge({
    hot: true,
    polyfills: {
      async: true
    }
  }, opts);

  neutrino.use(compile, {
    include: [neutrino.options.source, neutrino.options.tests],
    exclude: [neutrino.options.static],
    babel: compile.merge({
      plugins: [
        ...(options.polyfills.async ? [[require.resolve('fast-async'), { spec: true }]] : []),
        require.resolve('babel-plugin-dynamic-import-node')
      ],
      presets: [
        [require.resolve('babel-preset-env'), {
          debug: neutrino.options.debug,
          targets: { node: '6.10' },
          modules: false,
          useBuiltIns: true,
          exclude: options.polyfills.async ? ['transform-regenerator', 'transform-async-to-generator'] : []
        }]
      ]
    }, options.babel)
  });

  neutrino.config
    .when(sourceMap, () => neutrino.use(banner))
    .performance
      .hints(false)
      .end()
    .target('node')
    .node
      .set('__filename', false)
      .set('__dirname', false)
      .end()
    .devtool('source-map')
    .externals([nodeExternals({ whitelist: [/^webpack/] })])
    .context(neutrino.options.root)
    .entry('index')
      .add(neutrino.options.entry)
      .end()
    .output
      .path(neutrino.options.output)
      .filename('[name].js')
      .libraryTarget('commonjs2')
      .chunkFilename('[id].[hash:5]-[chunkhash:7].js')
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
    .when(neutrino.options.env.NODE_ENV !== 'development', () => {
      neutrino.use(clean, { paths: [neutrino.options.output] });
      neutrino.use(copy, {
        patterns: [{
          context: neutrino.options.static,
          from: '**/*',
          to: basename(neutrino.options.static)
        }]
      });
    }, (config) => {
      neutrino.use(startServer, {
        name: getOutputForEntry(neutrino.options.entry)
      });
      config.devtool('inline-sourcemap');
      config.output.devtoolModuleFilenameTemplate('[absolute-resource-path]');
      config.when(options.hot, () => {
        neutrino.use(hot);
        config.entry('index').add('webpack/hot/poll?1000');
      });
    });
};
