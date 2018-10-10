const babelMerge = require('babel-merge');

module.exports = (neutrino, { ruleId = 'compile', useId = 'babel', ...options } = {}) => {
  if (neutrino.config.module.rules.has(ruleId)) {
    throw new Error(
      '@neutrinojs/compile-loader has been used twice with the same `ruleId`.\n' +
      'If you are including this preset manually to customise the compile rules\n' +
      "configured by another preset, instead use that preset's own options to do so\n" +
      '(such as the `babel` option when using the Neutrino web/react/node/... presets).'
    );
  }

  neutrino.config.module
    .rule(ruleId)
    .test(options.test || neutrino.regexFromExtensions())
    .when(options.include, rule => rule.include.merge(options.include))
    .when(options.exclude, rule => rule.exclude.merge(options.exclude))
    .use(useId)
    .loader(require.resolve('babel-loader'))
    .options({
      cacheDirectory: true,
      babelrc: false,
      configFile: false,
      ...(options.babel || {})
    });

  neutrino.register('babel', (neutrino) =>
    neutrino.config.module
      .rule(ruleId)
      .use(useId)
      .get('options')
  );
};

module.exports.merge = babelMerge;
