const { DuplicateRuleError } = require('neutrino/errors');

module.exports = (neutrino, { ruleId = 'compile', useId = 'babel', ...options } = {}) => {
  if (neutrino.config.module.rules.has(ruleId)) {
    throw new DuplicateRuleError('@neutrinojs/compile-loader', ruleId);
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
