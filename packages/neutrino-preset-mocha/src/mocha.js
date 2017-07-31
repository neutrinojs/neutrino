const spawn = require('child_process').spawn;
const toParam = require('change-case').paramCase;

let proc;

module.exports = (mochaOpts = {}, babelOpts = {}, files = []) => new Promise((resolve, reject) => {
  if (proc) {
    proc.kill();
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

  proc = spawn(process.execPath, [require.resolve('mocha/bin/mocha'), ...argv, ...files], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  proc.on('close', code => (code !== 0 ? reject() : resolve()));
});
