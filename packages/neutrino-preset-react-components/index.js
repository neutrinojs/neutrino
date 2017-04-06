const react = require('neutrino-preset-react');
const banner = require('neutrino-middleware-banner');
const { join, basename } = require('path');
const { readdirSync } = require('fs');
const { path } = require('ramda');
const nodeExternals = require('webpack-node-externals');

const MODULES = join(__dirname, 'node_modules');

// During development, we start a storyboard application
const dev = neutrino => {
  neutrino.options.entry = join(neutrino.options.source, 'app.js');
  neutrino.options.html = {
    title: 'React Component Preview'
  };
  neutrino.use(react);
};

// During production, we create the React component as a library
const prod = neutrino => {
  let pkg = {};

  /* eslint-disable global-require, no-empty */
  try {
    pkg = require(join(neutrino.options.root, 'package.json'));
  } catch (ex) {}
  /* eslint-enable global-require no-empty */

  neutrino.options.components = join(neutrino.options.source, neutrino.options.components || 'components');
  neutrino.options.output = neutrino.options.output.endsWith('build') ?
    join(neutrino.options.root, 'lib') :
    neutrino.options.output;

  const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
    (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

  neutrino.use(react);

  neutrino.config
    .when(hasSourceMap, () => neutrino.use(banner))
    .entryPoints
      .delete('index')
      .end()
    .plugins
      .delete('html')
      .delete('chunk')
      .end()
    .devtool('source-map')
    .performance
      .hints(false)
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
};
