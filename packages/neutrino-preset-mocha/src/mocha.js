const { spawn } = require('child_process');
const { paramCase } = require('change-case');

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
        [...argv, `--${paramCase(key)}`] :
        [...argv, `--${paramCase(key)}`, value];
    }, ['--require', require.resolve('./register')]);

  proc = spawn(process.execPath, [require.resolve('mocha/bin/mocha'), ...argv, ...files], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  proc.on('close', code => (code !== 0 ? reject() : resolve()));
});
