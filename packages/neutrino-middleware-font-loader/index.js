const merge = require('deepmerge');

module.exports = ({ config }, options) => {
  const { limit } = merge({ limit: '10000' }, options);
  const urlLoader = require.resolve('url-loader');
  const fileLoader = require.resolve('file-loader');

  config.module
    .rule('woff')
    .test(/\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options({ limit, mimetype: 'application/font-woff' });

  config.module
    .rule('ttf')
    .test(/\.ttf(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options({ limit, mimetype: 'application/octet-stream' });

  config.module
    .rule('eot')
    .test(/\.eot(\?v=\d+\.\d+\.\d+)?$/)
    .use('file')
      .loader(fileLoader);
};
