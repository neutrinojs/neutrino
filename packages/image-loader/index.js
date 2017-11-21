const merge = require('deepmerge');

module.exports = (neutrino, options = {}) => {
  const isBuild = neutrino.options.command === 'build';
  const urlLoader = require.resolve('url-loader');
  const { limit, name } = merge({
    limit: 8192,
    name: isBuild ? '[name].[hash].[ext]' : '[name].[ext]'
  }, options);

  neutrino.config.module
    .rule('svg')
    .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit, name }, options.svg || {}));

  neutrino.config.module
    .rule('img')
    .test(/\.(png|jpg|jpeg|gif|webp)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit, name }, options.img || {}));

  neutrino.config.module
    .rule('ico')
    .test(/\.ico(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit, name }, options.ico || {}));
};
