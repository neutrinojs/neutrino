const merge = require('deepmerge');
const babelMinify = require('@neutrinojs/babel-minify');
const imageMinify = require('@neutrinojs/image-minify');
const styleMinify = require('@neutrinojs/style-minify');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    babel: {},
    image: {},
    style: {}
  }, opts);

  neutrino.config
    .when(options.babel, () => neutrino.use(babelMinify, options.babel))
    .when(options.image, () => neutrino.use(imageMinify, options.image))
    .when(options.style, () => neutrino.use(styleMinify, options.style));
};
