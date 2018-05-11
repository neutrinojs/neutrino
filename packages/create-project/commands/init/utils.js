const commandExists = require('command-exists');
const { packages, projects } = require('./matrix');

const isYarn = commandExists.sync('yarnpkg');

const sortPackages = ((a, b) => {
  const firstStr = a.startsWith('@') ? a.slice(1) : a;
  const secondStr = b.startsWith('@') ? b.slice(1) : b;

  return firstStr.localeCompare(secondStr);
});

module.exports = {
  packages,
  projects,
  isYarn,
  sortPackages
};
