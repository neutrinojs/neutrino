const merge = require('deepmerge');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const webp = require('imagemin-webp');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    imagemin: {
      plugins: [],
      optipng: {},
      gifsicle: {},
      jpegtran: {},
      svgo: {},
      pngquant: null,
      webp: {}
    },
    pluginId: 'imagemin'
  }, opts);

  if (options.webp) {
    options.imagemin.plugins.push(webp(options.webp));
  }

  neutrino.config
    .plugin(options.pluginId)
    .use(ImageminWebpackPlugin, [options.imagemin]);
};
