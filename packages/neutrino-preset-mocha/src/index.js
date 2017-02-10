const mocha = require('./mocha');
const merge = require('deepmerge');

module.exports = neutrino => {
  neutrino.on('test', (config, args) => {
    let loader;

    config.module.rules.some(r => {
      let l = r.use.find(l => l.loader.includes('babel-loader'));

      if (l) {
        loader = l;
        return true;
      }

      return false;
    });

    return mocha(neutrino.custom.mocha, loader.options, args.files);
  });

  neutrino.custom.mocha = {
    reporter: 'spec',
    ui: 'tdd',
    bail: true
  };

  const config = neutrino.configs.find(c => c.module.rules.has('compile'));

  config
    .module
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
};
