const chalk = require('chalk');
const { isYarn } = require('./utils');

module.exports = function() {
  const installer = isYarn ? 'yarn' : 'npm';
  const argument = isYarn ? 'add' : 'install';
  const development = isYarn ? '--dev' : '--save-dev';

  this.log(`${chalk.green('success')} Saved package.json`);

  process.chdir(this.options.directory);

  this.spawnCommandSync(installer, [argument, ...this.allDependencies.dependencies], { stdio: 'inherit' });
  this.spawnCommandSync(installer, [argument, development, ...this.allDependencies.devDependencies], { stdio: 'inherit' });

  if (this.data.linter) {
    this.spawnCommandSync('neutrino', ['lint', '--fix'], { stdio: 'ignore' });
  }
};
