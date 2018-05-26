const commandExists = require('command-exists');
const { packages, projects } = require('./matrix');

const isYarn = commandExists.sync('yarnpkg');

module.exports = {
  packages,
  projects,
  isYarn
};
