const chalk = require('chalk');

module.exports = function() {
  this.log(`Success! Created ${this.options.directory} at ${process.cwd()}`);
  this.log(`To get started, cd into the new directory: ${chalk.cyan(`cd ${this.options.directory}`)}`);
};
