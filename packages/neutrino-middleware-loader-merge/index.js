const merge = require('deepmerge');

module.exports = (ruleId, loaderId) => ({ config }, options) => config.module
  .rule(ruleId)
  .loader(loaderId, _opts => merge(_opts, options));
