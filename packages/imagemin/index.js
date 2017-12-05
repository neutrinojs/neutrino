const merge = require('deepmerge');
const ImageminWebpackPlugin = require('imagemin-webpack/ImageminWebpackPlugin');
const gifsicle = require('imagemin-gifsicle');
const svgo = require('imagemin-svgo');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const webp = require('imagemin-webp');

const imageminLoader = require.resolve('imagemin-webpack/imagemin-loader');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    imagemin: {
      plugins: [
        gifsicle(),
        svgo(),
        pngquant(),
        mozjpeg(),
        webp()
      ]
    },
    plugin: {
      name: '[path][name].[ext]'
    },
    pluginId: 'imagemin',
    useId: 'imagemin',
    rules: ['svg', 'img']
  }, opts);

  const test = options.rules.map((ruleId) => {
    neutrino.config.module
      .rule(ruleId)
      .use(options.useId)
        .loader(imageminLoader)
        .options(options.imagemin);

    return neutrino.config.module.rule(ruleId).get('test');
  })
  .filter(Boolean);

  options.plugin = merge({
    imageminOptions: options.imagemin,
    test
  }, options.plugin);

  neutrino.config
    .plugin(options.pluginId)
    .use(ImageminWebpackPlugin, [options.plugin]);
};
