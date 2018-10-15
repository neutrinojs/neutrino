const { DuplicateRuleError } = require('neutrino/errors');

module.exports = (neutrino, options = {}) => {
  const ruleId = 'font';
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultOptions = {
    name: isProduction ? 'assets/[name].[hash:8].[ext]' : 'assets/[name].[ext]'
  };

  if (neutrino.config.module.rules.has(ruleId)) {
    throw new DuplicateRuleError('@neutrinojs/font-loader', ruleId);
  }

  neutrino.config.module
    .rule(ruleId)
    .test(/\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
    .use('file')
      .loader(require.resolve('file-loader'))
      .options({ ...defaultOptions, ...options });
};
