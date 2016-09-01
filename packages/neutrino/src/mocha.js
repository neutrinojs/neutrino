const spawn = require('child_process').spawn;
const toParam = require('change-case').paramCase;

let proc;

module.exports = (config, done) => {
  if (proc) {
    proc.kill();
  }

  const babelLoader = config.module.loaders.find(loader => loader.loader.includes('babel'));
  const mocha = config.mocha;

  process.env.NEUTRINO_BABEL_CONFIG = JSON.stringify(babelLoader ? babelLoader.query : {});

  const args = Object
    .keys(mocha)
    .reduce((args, key) => {
      const value = mocha[key];

      return value === true ?
        args.concat(`--${toParam(key)}`) :
        args.concat(`--${toParam(key)}`, mocha[key]);
    }, ['--require', require.resolve('./register')]);

  proc = spawn('node_modules/.bin/mocha', args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  if (done) {
    proc.on('close', done);
  }
};