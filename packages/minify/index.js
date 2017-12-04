const babelMinify = require('@neutrinojs/babel-minify');
const imageMinify = require('@neutrinojs/image-minify');

module.exports = (neutrino, options = {}) => neutrino
  .use(babelMinify, options.babel || {})
  .use(imageMinify, options.image || {});
