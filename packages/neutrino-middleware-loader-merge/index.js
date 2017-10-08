const babelMerge = require('babel-merge');
const merge = require('deepmerge');

module.exports = (ruleId, loaderId) => ({ config }, options) => config.module
  .rule(ruleId)
  .use(loaderId)
  .tap(opts => (loaderId === 'babel' ? babelMerge(opts, options) : merge(opts, options)));
