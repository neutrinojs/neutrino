module.exports = (neutrino, options = {}) => {
  const isProduction = neutrino.config.get('mode') === 'production';
  const defaultOptions = {
    limit: 8192,
    name: isProduction ? '[name].[hash:8].[ext]' : '[name].[ext]'
  };

  neutrino.config.module
    .rule('image')
    .test(/\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(require.resolve('url-loader'))
      .options({ ...defaultOptions, ...options });
};
