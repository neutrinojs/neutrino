const { build } = require('../src');
const { defaultTo } = require('ramda');
const ora = require('ora');

module.exports = (middleware, options) => {
  const spinner = ora('Building project').start();

  return build(middleware, options)
    .fork((errors) => {
      spinner.fail('Building project failed');
      errors.forEach(err => console.error(err));
      process.exit(1);
    }, (stats) => {
      spinner.succeed('Building project completed');

      const options = defaultTo({
        colors: true,
        chunks: false,
        children: false
      }, stats.compilation.compiler.options.stats);

      console.log(stats.toString(options));
    });
};
