const merge = require('deepmerge');

module.exports = (ruleId, loaderId) => ({ config }, options) => config.module
  .rule(ruleId)
  .use(loaderId)
  .tap(opts => merge(opts, options));
