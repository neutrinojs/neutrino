const react = require('@neutrinojs/react');
const banner = require('@neutrinojs/banner');
const merge = require('deepmerge');
const nodeExternals = require('webpack-node-externals');
const { extname, join, basename } = require('path');
const { readdirSync } = require('fs');

const MODULES = join(__dirname, 'node_modules');
const NEUTRINO_MODULES = join(__dirname, '../../node_modules');

module.exports = (neutrino, options = {}) => {
  const reactOptions = merge({
    html: process.env.NODE_ENV === 'development' && {
      title: 'React Preview'
    },
    manifest: process.env.NODE_ENV === 'development',
    externals: {}
  }, options);

  neutrino.config.resolve.modules
    .add(MODULES)
    .add(NEUTRINO_MODULES);
  neutrino.config.resolveLoader.modules
    .add(MODULES)
    .add(NEUTRINO_MODULES);

  neutrino.config.when(
    process.env.NODE_ENV === 'development',
    () => {
      neutrino.options.mains.index = 'stories'; // eslint-disable-line no-param-reassign
      neutrino.use(react, reactOptions);
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

      // eslint-disable-next-line no-param-reassign
      neutrino.options.output = neutrino.options.output.endsWith('build') ?
        'lib' :
        neutrino.options.output;

      try {
        const pkg = require(join(neutrino.options.root, 'package.json')); // eslint-disable-line global-require
        const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
          (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

        hasSourceMap && neutrino.use(banner);
      } catch (ex) {} // eslint-disable-line

      neutrino.use(react, reactOptions);

      neutrino.config
        .devtool('source-map')
        .performance
          .hints('error')
          .end()
        .externals([nodeExternals(options.externals)])
        .output
          .filename('[name].js')
          .library('[name]')
          .libraryTarget('umd')
          .umdNamedDefine(true);
    }
  );

  neutrino.config.module
    .rule('css-modules')
      .test(/\.module.css$/)
      .include
        .add(neutrino.options.source)
        .end()
    .use('style')
      .loader(require.resolve('style-loader'))
      .end()
    .use('css')
      .loader(require.resolve('css-loader'))
      .options({ modules: true });

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
