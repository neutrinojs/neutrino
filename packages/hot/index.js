const { HotModuleReplacementPlugin, NamedModulesPlugin } = require('webpack');

module.exports = ({ config }) => config
  .plugin('hot')
    .use(HotModuleReplacementPlugin)
    .end()
  .plugin('named-modules')
    .use(NamedModulesPlugin);
