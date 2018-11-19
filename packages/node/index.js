const banner = require('@neutrinojs/banner');
const compile = require('@neutrinojs/compile-loader');
const clean = require('@neutrinojs/clean');
const startServer = require('@neutrinojs/start-server');
const nodeExternals = require('webpack-node-externals');
const {
  basename, parse, format
} = require('path');
const merge = require('deepmerge');
const omit = require('lodash.omit');
const { ConfigurationError } = require('neutrino/errors');

const getOutputForEntry = entry => basename(
  format(
    merge(
      omit(parse(entry), ['base']),
      { ext: '.js' }
    )
  )
);

module.exports = (neutrino, opts = {}) => {
  if ('polyfills' in opts) {
    throw new ConfigurationError(
      'The polyfills option has been removed, since polyfills are no longer included by default.'
    );
  }

  const pkg = neutrino.options.packageJson;
  const sourceMap = (pkg && pkg.dependencies && pkg.dependencies['source-map-support']) ||
    pkg && pkg.devDependencies && pkg.devDependencies['source-map-support'] ||
    false;
  const options = merge({
    hot: true,
    targets: {
      // Targets the version of Node.js used to run webpack.
      node: 'current'
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
          useBuiltIns: 'entry'
        }]
      ]
    }, options.babel)
  });

  Object.entries(neutrino.options.mains).forEach(([name, config]) =>
    neutrino.config.entry(name).add(config.entry)
  );

  neutrino.config
    .when(sourceMap, () => neutrino.use(banner))
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
      .libraryTarget('commonjs2')
      .end()
    .resolve
      .extensions
        .merge(neutrino.options.extensions.concat('json').map(ext => `.${ext}`))
        .end()
      .end()
    // The default output is too noisy, particularly with multiple entrypoints.
    .stats({
      children: false,
      entrypoints: false,
      modules: false
    })
    .when(process.env.NODE_ENV === 'development', (config) => {
      const mainKeys = Object.keys(neutrino.options.mains);

      neutrino.use(startServer, {
        name: getOutputForEntry(neutrino.options.mains[mainKeys[0]].entry)
      });
      config
        .devtool('inline-sourcemap')
        .output
          .devtoolModuleFilenameTemplate('[absolute-resource-path]')
          .end()
        .when(options.hot, (config) => {
          config.plugin('hot').use(require.resolve('webpack/lib/HotModuleReplacementPlugin'));
          mainKeys.forEach(key => {
            config
              .entry(key)
                .add(`${require.resolve('webpack/hot/poll')}?1000`);
          });
        });
    })
    .when(process.env.NODE_ENV === 'production', (config) => {
      config.when(options.clean, () => neutrino.use(clean, options.clean));
    });
};
