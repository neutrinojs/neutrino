const react = require('@neutrinojs/react');
const banner = require('@neutrinojs/banner');
const merge = require('deepmerge');
const nodeExternals = require('webpack-node-externals');
const { extname, join, basename } = require('path');
const { readdirSync } = require('fs');

module.exports = (opts = {}) => (neutrino) => {
  const options = merge(
    {
      html: process.env.NODE_ENV === 'development' && {
        title: 'React Preview',
      },
      externals: opts.externals !== false && {},
      style: {
        extract: {
          plugin: {
            // Override the @neutrinojs/react production behaviour of hashed CSS
            // filenames, and output to the build root, not an `assets/` subdirectory.
            filename: '[name].css',
          },
        },
      },
      devtool: {
        production: 'source-map',
      },
      targets: { browsers: 'ie 9' },
    },
    opts,
  );

  neutrino.config.when(
    process.env.NODE_ENV === 'development',
    () => {
      neutrino.use(react(options));
    },
    () => {
      const components = join(
        neutrino.options.source,
        options.components || 'components',
      );

      Object.keys(neutrino.options.mains).forEach((key) => {
        delete neutrino.options.mains[key]; // eslint-disable-line no-param-reassign
      });

      readdirSync(components).forEach((component) => {
        // eslint-disable-next-line no-param-reassign
        neutrino.options.mains[basename(component, extname(component))] = {
          entry: join(components, component),
        };
      });

      const pkg = neutrino.options.packageJson || {};
      const hasSourceMap =
        (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
        (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

      neutrino.use(react(options));

      neutrino.config
        .when(options.externals, (config) =>
          config.externals([nodeExternals(options.externals)]),
        )
        .when(hasSourceMap, () => neutrino.use(banner()))
        // Disable the chunking behaviour inherited from the react preset
        .optimization.splitChunks(false)
        .runtimeChunk(false)
        .end()
        .output // Override hashed filename/subdirectory usage inherited from @neutrinojs/react.
        .filename('[name].js')
        .library('[name]')
        .libraryTarget('umd')
        .umdNamedDefine(true);
    },
  );
};
