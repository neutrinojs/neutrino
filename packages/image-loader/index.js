const { DuplicateRuleError } = require('neutrino/errors');

module.exports = (neutrino, options = {}) => {
  const ruleId = 'image';
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultOptions = {
    limit: 8192,
    name: isProduction ? 'assets/[name].[hash:8].[ext]' : 'assets/[name].[ext]'
  };

  if (neutrino.config.module.rules.has(ruleId)) {
    throw new DuplicateRuleError('@neutrinojs/image-loader', ruleId);
  }

  neutrino.config.module
    .rule(ruleId)
    .test(/\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(require.resolve('url-loader'))
      .options({ ...defaultOptions, ...options });
};
