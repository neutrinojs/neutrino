const StylelintPlugin = require('stylelint-webpack-plugin');
const { formatters } = require('stylelint');

module.exports = (neutrino, opts = {}) => {
  const options = {
    pluginId: 'stylelint',
    configBasedir: neutrino.options.root,
    files: '**/*.+(css|scss|sass|less)',
    context: neutrino.options.source,
    formatter: formatters.string,
    ...opts
  };

  neutrino.config
    .plugin(options.pluginId)
    .use(StylelintPlugin, [options]);

  neutrino.register('stylelintrc', (neutrino, override) => override(
    neutrino.config
      .plugin('stylelint')
      .get('args')[0].config || {}
  ));
};
