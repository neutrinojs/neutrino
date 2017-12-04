const babelMinify = require('@neutrinojs/babel-minify');
const imageMinify = require('@neutrinojs/image-minify');

module.exports = (neutrino, options = {}) => {
  neutrino.config
    .when(options.babel, () => neutrino.use(babelMinify, options.babel !== true && options.babel || {}))
    .when(options.image, () => neutrino.use(imageMinify, options.image !== true && options.image || {}));
}
