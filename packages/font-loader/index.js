const merge = require('deepmerge');

module.exports = (neutrino, options = {}) => {
  const isBuild = neutrino.options.command === 'build';
  const urlLoader = require.resolve('url-loader');
  const fileLoader = require.resolve('file-loader');
  const { limit, name } = merge({
    limit: 10000,
    name: isBuild ? '[name].[hash].[ext]' : '[name].[ext]'
  }, options);

  neutrino.config.module
    .rule('woff')
    .test(/\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit, name, mimetype: 'application/font-woff' }, options.woff || {}));

  neutrino.config.module
    .rule('ttf')
    .test(/\.ttf(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit, name, mimetype: 'application/octet-stream' }, options.ttf || {}));

  neutrino.config.module
    .rule('eot')
    .test(/\.eot(\?v=\d+\.\d+\.\d+)?$/)
    .use('file')
      .loader(fileLoader)
      .options(merge({ name }, options.eot || {}));
};
