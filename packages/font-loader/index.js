module.exports = (neutrino, options = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultOptions = {
    name: isProduction ? '[name].[hash:8].[ext]' : '[name].[ext]'
  };

  neutrino.config.module
    .rule('font')
    .test(/\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
    .use('file')
      .loader(require.resolve('file-loader'))
      .options({ ...defaultOptions, ...options });
};
