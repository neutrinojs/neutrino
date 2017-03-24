const { build } = require('../src');
const ora = require('ora');

module.exports = (middleware, options) => {
  const spinner = ora('Building project').start();

  return build(middleware, options)
    .fork((errors) => {
      spinner.fail('Building project failed');
      errors.forEach((err) => {
        console.error(err.message || err.stack || err);
        err.details && console.error(err.details);
      });
      process.exit(1);
    }, (stats) => {
      spinner.succeed('Building project completed');
      console.log(stats.toString({
        colors: true,
        chunks: false,
        children: false
      }));
    });
};
