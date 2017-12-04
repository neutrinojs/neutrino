const babelMinify = require('@neutrinojs/babel-minify');
const imageMinify = require('@neutrinojs/image-minify');

module.exports = (neutrino, options = {
  babel: {},
  image: {}
}) => {

  neutrino.config
    .when(options.babel, () => neutrino.use(babelMinify, options.babel))
    .when(options.image, () => neutrino.use(imageMinify, options.image));
}
