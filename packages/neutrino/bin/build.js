const merge = require('deepmerge');
const ora = require('ora');
const { build } = require('../src');
const base = require('./base');

module.exports = (middleware, args) => {
  const spinner = args.quiet ? null : ora('Building project').start();

  return base({
    middleware,
    args,
    NODE_ENV: 'production',
    commandHandler: build,
    errorsHandler() {
      if (!args.quiet) {
        spinner.fail('Building project failed');
      }
    },
    successHandler(stats) {
      if (!args.quiet) {
        spinner.succeed('Building project completed');
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
