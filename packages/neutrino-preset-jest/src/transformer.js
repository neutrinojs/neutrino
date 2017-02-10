const babel = require('babel-core');

module.exports = {
  process(src, filename, config) {
    return babel.util.canCompile(filename) ?
      babel.transform(src, Object.assign({}, { filename }, config.globals.BABEL_OPTIONS)).code :
      src;
  }
};
