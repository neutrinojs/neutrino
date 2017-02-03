const spawn = require('child_process').spawn;
const toParam = require('change-case').paramCase;

let proc;

module.exports = (config, args, done) => {
  if (proc) {
    proc.kill();
  }

  const babelLoader = config.module.rules.find(r => r.use && r.use.loader && r.use.loader.includes('babel'));
  const mochaLoader = config.plugins.find(p => p.options && p.options.options && p.options.options.mocha);
  const mocha = mochaLoader ? mochaLoader.options.options.mocha : null;

  if (args.files) {
    mocha.recursive = true;
  }

  process.env.NEUTRINO_BABEL_CONFIG = JSON.stringify(babelLoader ? babelLoader.use.options : {});

  const argv = Object
    .keys(mocha)
    .reduce((argv, key) => {
      const value = mocha[key];

      return value === true ?
        argv.concat(`--${toParam(key)}`) :
        argv.concat(`--${toParam(key)}`, mocha[key]);
    }, ['--require', require.resolve('./register')]);

  proc = spawn(require.resolve('mocha/bin/mocha'), args.files ? argv.concat(args.files) : argv, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  if (done) {
    proc.on('close', done);
  }
};
