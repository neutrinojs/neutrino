const StylelintPlugin = require('stylelint-webpack-plugin');
const { formatters } = require('stylelint');

module.exports = (neutrino, { pluginId = 'stylelint', ...opts } = {}) => {
  const options = {
    configBasedir: neutrino.options.root,
    files: '**/*.+(css|scss|sass|less)',
    context: neutrino.options.source,
    // Fail for all of 'production', 'lint' and 'test'.
    failOnError: process.env.NODE_ENV !== 'development',
    formatter: formatters.string,
    ...opts
  };

  neutrino.config
    .plugin(pluginId)
    .use(StylelintPlugin, [options]);

  neutrino.register('stylelintrc', (neutrino, override) => override(
    neutrino.config
      .plugin('stylelint')
      .get('args')[0].config || {}
  ));
};
