const merge = require('deepmerge');

module.exports = ({ config }, options) => {
  const { limit } = merge({ limit: 8192 }, options);
  const urlLoader = require.resolve('url-loader');
  const svgUrlLoader = require.resolve('svg-url-loader');

  config.module
    .rule('svg')
    .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(svgUrlLoader)
      .options({ limit });

  config.module
    .rule('img')
    .test(/\.(png|jpg|jpeg|gif)$/)
    .use('url')
      .loader(urlLoader)
      .options({ limit });

  config.module
    .rule('ico')
    .test(/\.ico(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader);
};
