module.exports = (neutrino, options = {}) => {
  const isBuild = neutrino.options.command === 'build';
  const defaultOptions = {
    limit: 8192,
    name: isBuild ? '[name].[hash].[ext]' : '[name].[ext]'
  };

  neutrino.config.module
    .rule('image')
    .test(/\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(require.resolve('url-loader'))
      .options({ ...defaultOptions, ...options });
};
