const { Neutrino, build } = require('../src');
const merge = require('deepmerge');
const ora = require('ora');

const timeout = setTimeout(Function.prototype, 10000);

process.on('message', ([middleware, args]) => {
  clearTimeout(timeout);

  const spinner = args.quiet ? null : ora('Building project').start();
  const options = merge({
    args,
    command: args._[0],
    debug: args.debug,
    quiet: args.quiet,
    env: {
      NODE_ENV: 'production'
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .register('build', build)
    .use(middleware)
    .run('build')
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
});
