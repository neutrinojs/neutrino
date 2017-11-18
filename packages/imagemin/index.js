const merge = require('deepmerge');

const imageminLoader = require.resolve('imagemin-webpack/imagemin-loader');
const ImageminWebpackPlugin = require('imagemin-webpack/ImageminWebpackPlugin');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    imagemin: {},
    plugin: {}
  }, opts);

  options.plugin = merge({
    imageminOptions: options.imagemin
  }, options.plugin);

  neutrino.config.module
    .rule('svg')
    .use('imagemin')
      .loader(imageminLoader)
      .options(options.imagemin);

  neutrino.config.module
    .rule('img')
    .use('imagemin')
      .loader(imageminLoader)
      .options(options.imagemin);

  neutrino.use(ImageminWebpackPlugin, options.plugin);
};
