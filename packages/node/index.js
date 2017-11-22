const banner = require('@neutrinojs/banner');
const compile = require('@neutrinojs/compile-loader');
const copy = require('@neutrinojs/copy');
const clean = require('@neutrinojs/clean');
const startServer = require('@neutrinojs/start-server');
const hot = require('@neutrinojs/hot');
const nodeExternals = require('webpack-node-externals');
const { optimize } = require('webpack');
const {
  basename, join, parse, format
} = require('path');
const merge = require('deepmerge');
const {
  omit, partialRight, pathOr, pipe
} = require('ramda');

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
  const staticDir = join(neutrino.options.source, 'static');
  const sourceMap = pathOr(
    pathOr(false, ['dependencies', 'source-map-support'], pkg),
    ['devDependencies', 'source-map-support'],
    pkg
  );
  const options = merge({
    hot: true,
    polyfills: {
      async: true
    },
    targets: {
      node: '6.10'
    }
  }, opts);

  neutrino.use(compile, {
    include: [neutrino.options.source, neutrino.options.tests],
    exclude: [staticDir],
    babel: compile.merge({
      plugins: [
        ...(options.polyfills.async ? [[require.resolve('fast-async'), { spec: true }]] : []),
        require.resolve('babel-plugin-dynamic-import-node')
      ],
      presets: [
        [require.resolve('babel-preset-env'), {
          debug: neutrino.options.debug,
          targets: options.targets,
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
    .when(neutrino.options.command === 'start', (config) => {
      neutrino.use(startServer, {
        name: getOutputForEntry(neutrino.options.entry)
      });
      config.when(options.hot, () => {
        neutrino.use(hot);
        config.entry('index').add('webpack/hot/poll?1000');
      });
    })
    .when(neutrino.options.env.NODE_ENV === 'development', (config) => {
      config.devtool('inline-sourcemap');
      config.output.devtoolModuleFilenameTemplate('[absolute-resource-path]');
    })
    .when(neutrino.options.env.NODE_ENV === 'production', (config) => {
      config.plugin('module-concat').use(optimize.ModuleConcatenationPlugin);
    })
    .when(neutrino.options.command === 'build', () => {
      neutrino.use(clean, { paths: [neutrino.options.output] });
      neutrino.use(copy, {
        patterns: [{
          context: staticDir,
          from: '**/*',
          to: basename(staticDir)
        }]
      });
    });
};
