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
    this.log(`Success! Created ${this.options.directory} at ${process.cwd()}`);
    this.log(`To get started, cd into the new directory: ${chalk.cyan(`cd ${this.options.directory}`)}`);

    return done();
  });
};
