const react = require('@neutrinojs/react');
const banner = require('@neutrinojs/banner');
const compileLoader = require('@neutrinojs/compile-loader');
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
    babel: {},
    externals: opts.externals !== false && {},
    style: { extract: { plugin: { filename: '[name].css' } } }
  }, opts);

  Object.assign(options, {
    babel: compileLoader.merge({
      presets: [
        [require.resolve('@babel/preset-env'), {
          debug: neutrino.options.debug,
          forceAllTransforms: true,
          targets: { browsers: [] }
        }]
      ]
    }, options.babel)
  });

  const { targets } = options.babel.presets[0][1];

  if (targets.browsers && !targets.browsers.length) {
    targets.browsers.push(
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Edge versions',
      'last 2 Opera versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    );
  }

  neutrino.use(compileLoader, {
    include: [
      neutrino.options.source,
      neutrino.options.tests
    ],
    babel: options.babel
  });

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
