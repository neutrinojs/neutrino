const spawn = require('child_process').spawn;
const toParam = require('change-case').paramCase;

let proc;

module.exports = (mochaOpts = {}, babelOpts = {}, files = []) => new Promise(resolve => {
  if (proc) {
    proc.kill();
  }

  if (files.length) {
    mochaOpts.recursive = true;
  }

  process.env.NEUTRINO_BABEL_CONFIG = JSON.stringify(babelOpts);

  const argv = Object
    .keys(mochaOpts)
    .reduce((argv, key) => {
      const value = mochaOpts[key];

      return value === true ?
        [...argv, `--${toParam(key)}`] :
        [...argv, `--${toParam(key)}`, value];
    }, ['--require', require.resolve('./register')]);

  proc = spawn(require.resolve('mocha/bin/mocha'), [...argv, ...files], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  proc.on('close', resolve);
});
