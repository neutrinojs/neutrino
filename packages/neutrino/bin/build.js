const merge = require('deepmerge');
const ora = require('ora');
const { build } = require('../src');
const base = require('./base');

module.exports = (middleware, args) => {
  const spinner = ora({ text: 'Building project' });

  return base({
    middleware,
    args,
    NODE_ENV: 'production',
    commandHandler: (config, neutrino) => {
      if (!args.quiet) {
        spinner.enabled = global.interactive;
        spinner.start();
      }

      return build(config, neutrino);
    },
    errorsHandler() {
      if (!args.quiet) {
        spinner.fail('Building project failed');
      }
    },
    successHandler(stats) {
      if (args.quiet) {
        return;
      }

      spinner.succeed('Building project completed');

      if (stats) {
        console.log(stats.toString(merge({
          modules: false,
          colors: true,
          chunks: false,
          children: false
        }, stats.compilation.compiler.options.stats || {})));
      }
    }
  });
};
