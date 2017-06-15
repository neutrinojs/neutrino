const Neutrino = require('./api');
const build = require('./build');
const start = require('./start');
const test = require('./test');
const inspect = require('./inspect');

module.exports = {
  Neutrino,
  build,
  start,
  test,
  inspect(args) {
    return args.customInspect ? this : inspect(args);
  }
};
