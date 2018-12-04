const commandExists = require('command-exists');

const isYarn = commandExists.sync('yarnpkg');

// Adds gitignore like create-react-app
const generateGitignoreContents = () => ['build', '/node_modules', '/.pnp', '.pnp.js', '/coverage', '.DS_Store', '.env.local', '.env.development.local', '.env.test.local', '.env.production.local', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'].join('\n');


module.exports = {
  isYarn,
  generateGitignoreContents
};
