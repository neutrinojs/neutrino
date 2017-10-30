const chalk = require('chalk');
const isYarn = require('./utils').isYarn;

module.exports = function() {
  const installer = isYarn ? 'yarnInstall' : 'npmInstall';
  const devOptions = isYarn ? { dev: true } : { 'save-dev' : true};

  this.log(`${chalk.green('success')} Saved package.json`);
  process.chdir(this.options.directory);
  this[installer](this.allDependencies.dependencies);
  this[installer](this.allDependencies.devDependencies, devOptions);
};
