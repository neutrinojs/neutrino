const react = require('neutrino-preset-react');
const banner = require('neutrino-middleware-banner');
const { join, basename } = require('path');
const { readdirSync } = require('fs');
const { path } = require('ramda');
const nodeExternals = require('webpack-node-externals');

const MODULES = join(__dirname, 'node_modules');

// During development, we start a storyboard application
const dev = neutrino => {
  neutrino.options.entry = 'stories.js';
  neutrino.options.html = {
    title: 'React Preview'
  };
  neutrino.use(react);
  neutrino.config.entryPoints.delete('polyfill');
};

// During production, we create the React component as a library
const prod = neutrino => {
  let pkg = {};

  try {
    pkg = require(join(neutrino.options.root, 'package.json'));
  } catch (ex) {}

  neutrino.options.components = join(neutrino.options.source, neutrino.options.components || 'components');

  if (neutrino.options.output.endsWith('build')) {
    neutrino.options.output = 'lib';
  }

  const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
    (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

  neutrino.use(react);

  neutrino.config
    .when(hasSourceMap, () => neutrino.use(banner))
    .entryPoints
      .delete('index')
      .delete('polyfill')
      .end()
    .plugins
      .delete('html')
      .end()
    .devtool('source-map')
    .performance
      .hints(true)
      .end()
    .externals([nodeExternals()])
    .output
      .filename('[name].js')
      .library('[name]')
      .libraryTarget('umd')
      .umdNamedDefine(true);

  readdirSync(neutrino.options.components)
    .map(component => neutrino.config
        .entry(basename(component, '.js'))
        .add(join(neutrino.options.components, component)));
};

module.exports = neutrino => {
  if (!path(['options', 'compile', 'targets', 'browsers'], neutrino)) {
    Object.assign(neutrino.options, {
      compile: {
        targets: {
          browsers: [
            'last 1 Chrome versions',
            'last 1 Firefox versions',
            'last 1 Edge versions',
            'last 1 Safari versions',
            'last 1 iOS versions'
          ]
        }
      }
    });
  }
  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);
  neutrino.use(process.env.NODE_ENV === 'development' ? dev : prod);
  neutrino.config.module
    .rule('plain-style')
      .test(/\.css$/)
      .include
        .add(/node_modules/).end()
      .use('style')
        .loader(require.resolve('style-loader'))
        .end()
      .use('css')
          .loader(require.resolve('css-loader'));

  neutrino.config.module
    .rule('style')
      .exclude
        .add(/node_modules/).end()
      .use('css')
        .options({ modules: true });

  neutrino.config.module
    .rule('worker')
    .test(/\.worker\.js$/)
    .use('worker')
    .loader(require.resolve('worker-loader'));

  neutrino.config.plugins
    .when(process.env.NODE_ENV !== 'test', plugins => plugins.delete('chunk'));

  neutrino.config.node.set('Buffer', false);

  const compile = neutrino.config.module.rule('compile');
  const includes = compile.include.values().filter(include => !include.includes('polyfills.js'));

  compile
    .include
      .clear()
      .merge(includes)
      .end()
    .use('babel')
      .tap(options => {
        const presetEnvOptions = options.presets[0][1];

        presetEnvOptions.useBuiltIns = false;
        presetEnvOptions.exclude = ['transform-regenerator', 'transform-async-to-generator'];
        options.plugins.push([require.resolve('fast-async'), { spec: true }]);

        return options;
      });
};
