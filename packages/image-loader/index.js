const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    limit: 8192,
    imagemin: {
      enabled: neutrino.options.env.NODE_ENV === 'production'
    }
  }, opts);
  const { limit } = options;
  const urlLoader = require.resolve('url-loader');
  const imgLoader = require.resolve('img-loader');

  neutrino.config.module
    .rule('svg')
    .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit }, options.svg || {}))
      .end()
    .use('imagemin')
      .loader(imgLoader)
      .options(options.imagemin);

  neutrino.config.module
    .rule('img')
    .test(/\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit }, options.img || {}))
      .end()
    .use('imagemin')
      .loader(imgLoader)
      .options(options.imagemin);

  neutrino.config.module
    .rule('ico')
    .test(/\.ico(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit }, options.ico || {}));
};
