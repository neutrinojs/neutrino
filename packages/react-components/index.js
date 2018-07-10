const react = require('@neutrinojs/react');
const banner = require('@neutrinojs/banner');
const merge = require('deepmerge');
const nodeExternals = require('webpack-node-externals');
const { extname, join, basename } = require('path');
const { readdirSync } = require('fs');

module.exports = (neutrino, opts = {}) => {
  const mode = neutrino.config.get('mode');
  const options = merge({
    html: mode === 'development' && {
      title: 'React Preview'
    },
    manifest: mode === 'development',
    externals: opts.externals !== false && {},
    style: { extract: { plugin: { filename: '[name].css' } } },
    targets: { browsers: 'ie 9' }
  }, opts);

  neutrino.config.when(
    mode === 'development',
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

      const pkg = neutrino.options.packageJson || {};
      const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
        (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

      neutrino.use(react, options);

      // Remove the html generation plugins added by the react preset
      neutrino.config.plugins.delete('html-sibling-chunks');
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
        // Disable the chunking behaviour inherited from the react preset
        .optimization
          .splitChunks(false)
          .runtimeChunk(false)
          .end()
        .output
          .filename('[name].js')
          .library('[name]')
          .libraryTarget('umd')
          .umdNamedDefine(true);
    }
  );
};
