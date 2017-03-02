const merge = require('deepmerge');

module.exports = ({ config }, options) => {
  const { limit } = merge({ limit: 8192 }, options);
  const urlLoader = require.resolve('url-loader');

  config.module
    .rule('svg')
    .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
    .loader('url', urlLoader, { limit, mimetype: 'application/svg+xml' });

  config.module
    .rule('img')
    .test(/\.(png|jpg|jpeg|gif)$/)
    .loader('url', urlLoader, { limit });

  config.module
    .rule('ico')
    .test(/\.ico(\?v=\d+\.\d+\.\d+)?$/)
    .loader('url', urlLoader);
};
