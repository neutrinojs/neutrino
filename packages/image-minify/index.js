const merge = require('deepmerge');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const webp = require('imagemin-webp');
const mozjpeg = require('imagemin-mozjpeg');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    imagemin: {
      plugins: [],
      optipng: null,
      gifsicle: {},
      jpegtran: null,
      svgo: {},
      pngquant: {},
      webp: {}
    },
    pluginId: 'imagemin'
  }, opts);

  if (options.webp) {
    options.imagemin.plugins.push(webp(options.webp));
  }

  if (options.mozjpeg) {
    options.imagemin.plugins.push(mozjpeg(options.mozjpeg));
  }

  neutrino.config
    .plugin(options.pluginId)
    .use(ImageminWebpackPlugin, [options.imagemin]);
};
