const mocha = require('./mocha');
const merge = require('deepmerge');

module.exports = neutrino => {
  const defaults = {
    reporter: 'spec',
    ui: 'tdd',
    bail: true
  };

  neutrino.config.module
    .rule('compile')
    .loader('babel', props => merge(props, {
      options: {
        env: {
          test: {
            plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
          }
        }
      }
    }));

  neutrino.on('test', ({ files }) => mocha(
    merge(defaults, neutrino.options.mocha),
    neutrino.config.module.rule('compile').loaders.get('babel').options,
    files
  ));
};
