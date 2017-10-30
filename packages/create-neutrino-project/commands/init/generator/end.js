const chalk = require('chalk');

module.exports = function() {
  this.log(`Success! Created ${this.options.directory} at ${process.cwd()}`);
  this.log(`To get started, change your current working directory to: ${chalk.cyan(this.options.directory)}`);
};
