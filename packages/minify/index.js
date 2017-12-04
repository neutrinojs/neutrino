const babelMinify = require('@neutrinojs/babel-minify');
const imageMinify = require('@neutrinojs/image-minify');

module.exports = (neutrino, options = {}) => {
  neutrino.use(babelMinify, options.babel || {});
  neutrino.use(imageMinify, options.image || {});
}
