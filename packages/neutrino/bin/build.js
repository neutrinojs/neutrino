const { Neutrino, build } = require('../src');
const { defaultTo } = require('ramda');
const merge = require('deepmerge');
const ora = require('ora');

module.exports = (middleware, args) => {
  const spinner = ora('Building project').start();
  const options = merge({
    args,
    debug: args.debug,
    env: {
      NODE_ENV: 'production'
    }
  }, args.options);
  const api = Neutrino(options);

  return api
    .run('build', middleware, build)
    .fork((errors) => {
      spinner.fail('Building project failed');
      errors.forEach(err => console.error(err));
      process.exit(1);
    }, (stats) => {
      spinner.succeed('Building project completed');
      console.log(stats.toString(defaultTo({
        colors: true,
        chunks: false,
        children: false
      }, stats.compilation.compiler.options.stats)));
    });
};
