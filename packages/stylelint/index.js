const merge = require('deepmerge');
const { join } = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { lint, formatters } = require('stylelint');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    pluginId: 'stylelint',
    files: '**/*.+(css|scss|sass|less)',
    context: neutrino.options.source,
    failOnError: neutrino.options.command !== 'start',
    quiet: neutrino.options.command === 'start',
    formatter: formatters.string
  }, opts);

  const getStylelintRcConfig = config => config
    .plugin(options.pluginId)
    .get('args')[0].config || {};

  neutrino.register(
    'stylelint',
    () => {
      const { fix = false } = neutrino.options.args;
      const files = join(options.context, options.files);

      return lint(merge(options, { fix, files }))
        .then(result => Promise[result.errored ? 'reject' : 'resolve'](result.output));
    },
    'Perform a one-time lint using stylelint. Apply available automatic fixes with --fix'
  );

  neutrino.register(
    'stylelintrc',
    () => getStylelintRcConfig(neutrino.config),
    'Return an object of accumulated stylelint configuration suitable for use by .stylelintrc.js'
  );

  neutrino.config
    .plugin(options.pluginId)
    .use(StylelintPlugin, [options]);
};
