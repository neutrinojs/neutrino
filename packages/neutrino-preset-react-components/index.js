const react = require('neutrino-preset-react');
const banner = require('neutrino-middleware-banner');
const { join, basename } = require('path');
const { readdirSync } = require('fs');
const nodeExternals = require('webpack-node-externals');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, options = {}) => {
  const reactOptions = {
    polyfills: {
      babel: process.env.NODE_ENV === 'development'
    },
    html: {
      title: 'React Preview'
    },
    babel: {
      plugins: [require.resolve('babel-plugin-transform-es2015-classes')],
      presets: [
        ['babel-preset-env', {
          targets: {
            browsers: [
              'last 1 Chrome versions',
              'last 1 Firefox versions',
              'last 1 Edge versions',
              'last 1 Safari versions',
              'last 1 iOS versions'
            ]
          }
        }]
      ]
    }
  };

  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);

  neutrino.config.when(process.env.NODE_ENV === 'development',
    config => {
      neutrino.options.entry = 'stories';
      neutrino.use(react, reactOptions);
    },
    () => {
      const components = join(neutrino.options.source, options.components || 'components');

      neutrino.options.output = neutrino.options.output.endsWith('build') ?
        'lib' :
        neutrino.options.output;

      try {
        const pkg = require(join(neutrino.options.root, 'package.json'));
        const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
          (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

        hasSourceMap && neutrino.use(banner);
      } catch (ex) {}

      neutrino.use(react, reactOptions);

      neutrino.config
        .devtool('source-map')
        .entryPoints.delete('index').end()
        .plugins.delete('html').end()
        .performance.hints(true).end()
        .externals([nodeExternals()])
        .output
          .filename('[name].js')
          .library('[name]')
          .libraryTarget('umd')
          .umdNamedDefine(true);

      readdirSync(components)
        .map(component => neutrino.config
          .entry(basename(component, '.js'))
            .add(join(components, component)));
    });

  neutrino.config.module
    .rule('plain-style')
      .test(/\.css$/)
      .include
        .add(neutrino.options.node_modules).end()
      .use('style')
        .loader(require.resolve('style-loader'))
        .end()
      .use('css')
        .loader(require.resolve('css-loader'))
        .options({ modules: false });

  neutrino.config.module
    .rule('style')
      .exclude
        .add(neutrino.options.node_modules).end()
      .use('css')
        .options({ modules: true });

  neutrino.config.when(neutrino.config.plugins.has('runtime-chunk'),
    config => {
      config.plugins
        .delete('runtime-chunk')
        .delete('vendor-chunk')
        .delete('named-modules')
        .delete('named-chunks')
        .delete('name-all');
    });
};
