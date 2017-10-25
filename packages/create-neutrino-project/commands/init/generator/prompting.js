const questions = require('./questions');

module.exports = function () {
  const defaults = {
    author: '',
    description: 'Get Started with Neutrino!'
  };
  const done = this.async();
  const command = this.spawnCommand('bash', [
    '-c',
    'echo -n "$(npm config get init-author-name)"'
  ], { stdio: 'pipe' });

  command.stdout.on('data', data => defaults.author += data);
  command.on('close', () => this
    .prompt(questions(defaults))
    .then(answers => {
      this.data = answers;

      done();
    })
  );
};
