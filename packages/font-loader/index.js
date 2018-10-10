module.exports = (neutrino, options = {}) => {
  const ruleId = 'font';
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultOptions = {
    name: isProduction ? '[name].[hash:8].[ext]' : '[name].[ext]'
  };

  if (neutrino.config.module.rules.has(ruleId)) {
    throw new Error(
      '@neutrinojs/font-loader has been used twice.\n' +
      'If you are including this preset manually to customise the font rule\n' +
      "configured by another preset, instead use that preset's own options to do so\n" +
      '(such as the `font` option when using the Neutrino web/react/vue/... presets).'
    );
  }

  neutrino.config.module
    .rule(ruleId)
    .test(/\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
    .use('file')
      .loader(require.resolve('file-loader'))
      .options({ ...defaultOptions, ...options });
};
