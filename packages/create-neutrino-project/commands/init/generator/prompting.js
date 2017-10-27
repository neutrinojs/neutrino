const questions = require('./questions');

module.exports = function () {
  const done = this.async();

  this
    .prompt(questions())
    .then(answers => {
      this.data = answers;

      done();
    });
};
