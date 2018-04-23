const react = require('@neutrinojs/react');
const banner = require('@neutrinojs/banner');
const merge = require('deepmerge');
const nodeExternals = require('webpack-node-externals');
const { extname, join, basename } = require('path');
const { readdirSync } = require('fs');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    html: process.env.NODE_ENV === 'development' && {
      title: 'React Preview'
    },
    manifest: process.env.NODE_ENV === 'development',
    externals: opts.externals !== false && {},
    style: { extract: { plugin: { filename: '[name].css' } } }
  }, opts);

  neutrino.config.resolve.modules
    .add(MODULES)
    .when(__dirname.includes('neutrino-dev'), modules => {
      // Add monorepo node_modules to webpack module resolution
      modules.add(join(__dirname, '../../node_modules'));
    });
  neutrino.config.resolveLoader.modules
    .add(MODULES)
    .when(__dirname.includes('neutrino-dev'), modules => {
      // Add monorepo node_modules to webpack module resolution
      modules.add(join(__dirname, '../../node_modules'));
    });

  neutrino.config.when(
    process.env.NODE_ENV === 'development',
    () => {
      neutrino.use(react, options);
    },
    () => {
      const components = join(neutrino.options.source, options.components || 'components');

      Object
        .keys(neutrino.options.mains)
        .forEach(key => {
          delete neutrino.options.mains[key]; // eslint-disable-line no-param-reassign
        });

      readdirSync(components).forEach(component => {
        // eslint-disable-next-line no-param-reassign
        neutrino.options.mains[basename(component, extname(component))] = join(components, component);
      });

      const pkg = neutrino.options.packageJson;
      const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
        (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

      neutrino.use(react, options);

      Object
        .keys(neutrino.options.mains)
        .forEach(key => {
          neutrino.config.plugins.delete(`html-${key}`);
        });

      neutrino.config
        .when(options.externals, config => config.externals([nodeExternals(options.externals)]))
        .when(hasSourceMap, () => neutrino.use(banner))
        .devtool('source-map')
        .performance
          .hints('error')
          .end()
        .output
          .filename('[name].js')
          .library('[name]')
          .libraryTarget('umd')
          .umdNamedDefine(true);
    }
  );

  neutrino.config.when(
    neutrino.config.plugins.has('runtime-chunk'),
    (config) => {
      config.plugins
        .delete('runtime-chunk')
        .delete('vendor-chunk')
        .delete('named-modules')
        .delete('named-chunks')
        .delete('name-all');
    }
  );
};
