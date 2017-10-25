const commandExists = require('command-exists');

module.exports = function() {
  const isYarnAvailable = commandExists.sync('yarnpkg');

  this.installDependencies({
    yarn: isYarnAvailable,
    npm: !isYarnAvailable,
    bower: false
  });
};
