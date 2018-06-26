const commandExists = require('command-exists');

const isYarn = commandExists.sync('yarnpkg');

module.exports = {
  isYarn
};
