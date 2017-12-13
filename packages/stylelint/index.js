const merge = require('deepmerge');
const StylelintPlugin = require('stylelint-webpack-plugin');

const getStylelintRcConfig = config => config.plugin('stylelint').get('args')[0].config;

module.exports = (neutrino, opts = {}) => {
  const getTestForRules = (rules) => rules
    .map(ruleId => neutrino.config.module.rule(ruleId).get('test'))
    .filter(Boolean);

  const options = merge({
    pluginid: 'stylelint',
    plugin: {
      config: neutrino.config.module.rule('lint').use('stylelint').get('options'),
      files: getTestForRules(['style']),
      context: neutrino.options.source
      // temporary fix for HMR issues with stylelint errors
      // (see JaKXz/stylelint-webpack-plugin#24)
      // failOnError: false
    }
  }, opts);

  neutrino.register(
    'stylelintrc',
    () => getStylelintRcConfig(neutrino.config),
    'Return an object of accumulated ESLint configuration suitable for use by .eslintrc.js'
  );

  neutrino.config
    .plugin(options.pluginId)
    .use(StylelintPlugin, [options.plugin]);
};
