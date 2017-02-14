const mocha = require('./mocha');
const merge = require('deepmerge');

module.exports = neutrino => {
  neutrino.custom.mocha = {
    reporter: 'spec',
    ui: 'tdd',
    bail: true
  };

  neutrino.config.module
    .rule('compile')
    .loader('babel', ({ options }) => {
      return {
        options: merge(options, {
          env: {
            test: {
              plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
            }
          }
        })
      };
    });

  neutrino.on('test', ({ files }) => {
    const babelOptions = neutrino.config.module.rule('compile').loaders.get('babel').options;

    return mocha(neutrino.custom.mocha, babelOptions, files);
  });
};
