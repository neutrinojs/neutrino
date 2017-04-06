const node = require('neutrino-preset-node');
const react = require('neutrino-preset-react');
const merge = require('neutrino-middleware-loader-merge');
const style = require('neutrino-middleware-style-loader');
const { join, basename } = require('path');
const { readdirSync } = require('fs');

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
  neutrino.options.components = join(neutrino.options.source, neutrino.options.components || 'components');
  neutrino.options.output = neutrino.options.output.endsWith('build') ?
    join(neutrino.options.root, 'lib') :
    neutrino.options.output;
  neutrino.use(node);
  neutrino.use(style);
  neutrino.use(merge('compile', 'babel'), {
    presets: [require.resolve('babel-preset-react')],
    plugins: [require.resolve('babel-plugin-transform-object-rest-spread')]
  });

  neutrino.config.entryPoints.delete('index');

  readdirSync(neutrino.options.components)
    .map(component => neutrino.config
        .entry(basename(component, '.js'))
        .add(join(neutrino.options.components, component)));

  neutrino.config
    .output
      .library('[name]')
      .libraryTarget('umd')
      .umdNamedDefine(true);
};

module.exports = neutrino => {
  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);
  neutrino.use(process.env.NODE_ENV === 'development' ? dev : prod);
};
