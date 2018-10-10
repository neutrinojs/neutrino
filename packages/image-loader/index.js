module.exports = (neutrino, options = {}) => {
  const ruleId = 'image';
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultOptions = {
    limit: 8192,
    name: isProduction ? '[name].[hash:8].[ext]' : '[name].[ext]'
  };

  if (neutrino.config.module.rules.has(ruleId)) {
    throw new Error(
      '@neutrinojs/image-loader has been used twice.\n' +
      'If you are including this preset manually to customise the image rule\n' +
      "configured by another preset, instead use that preset's own options to do so\n" +
      '(such as the `image` option when using the Neutrino web/react/vue/... presets).'
    );
  }

  neutrino.config.module
    .rule(ruleId)
    .test(/\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(require.resolve('url-loader'))
      .options({ ...defaultOptions, ...options });
};
