const banner = require('@neutrinojs/banner');
const compile = require('@neutrinojs/compile-loader');
const clean = require('@neutrinojs/clean');
const startServer = require('@neutrinojs/start-server');
const hot = require('@neutrinojs/hot');
const nodeExternals = require('webpack-node-externals');
const {
  basename, join, parse, format
} = require('path');
const merge = require('deepmerge');
const omit = require('lodash.omit');

const MODULES = join(__dirname, 'node_modules');
const getOutputForEntry = entry => basename(
  format(
    merge(
      omit(parse(entry), ['base']),
      { ext: '.js' }
    )
  )
);

module.exports = (neutrino, opts = {}) => {
  const pkg = neutrino.options.packageJson;
  const sourceMap = (pkg && pkg.dependencies && pkg.dependencies['source-map-support']) ||
    pkg && pkg.devDependencies && pkg.devDependencies['source-map-support'] ||
    false;
  const options = merge({
    hot: true,
    targets: {
      node: '8.3'
    },
    clean: opts.clean !== false && {
      paths: [neutrino.options.output]
    }
  }, opts);

  neutrino.use(compile, {
    include: [neutrino.options.source, neutrino.options.tests],
    babel: compile.merge({
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import')
      ],
      presets: [
        [require.resolve('@babel/preset-env'), {
          debug: neutrino.options.debug,
          targets: options.targets,
          modules: false,
          useBuiltIns: 'entry'
        }]
      ]
    }, options.babel)
  });

  Object
    .keys(neutrino.options.mains)
    .forEach(key => neutrino.config.entry(key).add(neutrino.options.mains[key]));

  const mode = neutrino.config.get('mode');

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
        .when(__dirname.includes('neutrino-dev'), modules => {
          // Add monorepo node_modules to webpack module resolution
          modules.add(join(__dirname, '../../node_modules'));
        })
        .end()
      .extensions
        .merge(neutrino.options.extensions.concat('json').map(ext => `.${ext}`))
        .end()
      .end()
    .resolveLoader
      .modules
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .when(__dirname.includes('neutrino-dev'), modules => {
          // Add monorepo node_modules to webpack module resolution
          modules.add(join(__dirname, '../../node_modules'));
        })
        .end()
      .end()
    .when(neutrino.options.debug, (config) => {
      config.merge({
        stats: {
          maxModules: Infinity,
          optimizationBailout: true
        }
      });
    })
    .when(mode === 'development', (config) => {
      const mainKeys = Object.keys(neutrino.options.mains);

      neutrino.use(startServer, {
        name: getOutputForEntry(neutrino.options.mains[mainKeys[0]])
      });
      config
        .devtool('inline-sourcemap')
        .output
          .devtoolModuleFilenameTemplate('[absolute-resource-path]')
          .end()
        .when(options.hot, () => {
          neutrino.use(hot);
          mainKeys.forEach(key => {
            neutrino.config
              .entry(key)
                .add(`${require.resolve('webpack/hot/poll')}?1000`);
          });
        });
    })
    .when(mode === 'production', (config) => {
      config.when(options.clean, () => neutrino.use(clean, options.clean));
    });
};
