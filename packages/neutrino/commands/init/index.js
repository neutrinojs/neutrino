'use strict';

const yeoman = require('yeoman-environment');
const crypto = require('crypto');
const npm = require('npm');
const os = require('os');
const path = require('path');

const env = yeoman.createEnv();

module.exports = (args, done) => {
  // For initializing a project, the preset is not installed in the project.
  // Rather, we install it ourselves into a temp directory and invoke from there.
  const tempDir = path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex'));
  const packageName = args.packageName;

  npm.load({ loglevel: 'silent' }, (err, npm) => {
    if (err) {
      console.error(err);
      return done(1);
    }

    const pkg = path.join(tempDir, 'node_modules', packageName.startsWith('@') || !packageName.includes(path.sep) ?
      packageName :
      path.basename(packageName));

    npm.commands.install(tempDir, [packageName], (err) => {
      if (err) {
        console.error(err);
        return done(1);
      }

      env.register(pkg, 'neutrino:init');
      env.run('neutrino:init', done);
    });
  });
};
