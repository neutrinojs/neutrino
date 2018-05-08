module.exports = (neutrino, options = {}) => {
  const isBuild = neutrino.options.command === 'build';
  const defaultOptions = {
    name: isBuild ? '[name].[hash].[ext]' : '[name].[ext]'
  };

  neutrino.config.module
    .rule('font')
    .test(/\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
    .use('file')
      .loader(require.resolve('file-loader'))
      .options({ ...defaultOptions, ...options });
};
