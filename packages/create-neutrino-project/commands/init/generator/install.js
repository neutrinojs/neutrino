const chalk = require('chalk');
const isYarn = require('./utils').isYarn;

module.exports = function() {
  this.log(`${chalk.green('success')} Saved package.json`);
  const done = this.async();
  const installCommand = isYarn ? 'yarn add' : 'npm install';

  const command = this.spawnCommand('bash', [
    '-c',
    [
      `cd ${this.options.directory}`,
      this.allDependencies.dependencies ?
        `${installCommand} ${this.allDependencies.dependencies.join(' ')}` :
        ':',
      this.allDependencies.devDependencies ?
        `${installCommand} -D ${this.allDependencies.devDependencies.join(' ')}` :
        ':'
    ].join('&&')
  ], { stdio: 'inherit' });

  command.on('close', () => {
    return done();
  });
};
