module.exports = (neutrino, options = {}) => {
  const isProduction = neutrino.config.get('mode') === 'production';
  const defaultOptions = {
    name: isProduction ? '[name].[hash].[ext]' : '[name].[ext]'
  };

  neutrino.config.module
    .rule('font')
    .test(/\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
    .use('file')
      .loader(require.resolve('file-loader'))
      .options({ ...defaultOptions, ...options });
};
