const { Neutrino, build } = require('../src');
const merge = require('deepmerge');
const ora = require('ora');

module.exports = (middleware, args) => {
  const spinner = args.quiet ? null : ora('Building project').start();
  const options = merge({
    args,
    debug: args.debug,
    quiet: args.quiet,
    env: {
      NODE_ENV: 'production'
    }
  }, args.options);
  const api = Neutrino(options);

  api.register('build', build);

  return api
    .run('build', middleware)
    .fork((errors) => {
      if (!args.quiet) {
        spinner.fail('Building project failed');
        errors.forEach(err => console.error(err));
      }

      process.exit(1);
    }, (stats) => {
      if (!args.quiet) {
        spinner.succeed('Building project completed');
        console.log(stats.toString(merge({
          modules: false,
          colors: true,
          chunks: false,
          children: false
        }, stats.compilation.compiler.options.stats || {})));
      }
    });
};
