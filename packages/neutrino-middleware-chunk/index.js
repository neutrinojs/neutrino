const { optimize, NamedChunksPlugin, NamedModulesPlugin } = require('webpack');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const { relative } = require('path');

module.exports = ({ config }) => config
  .plugin('named-modules')
    .use(NamedModulesPlugin).end()
  .plugin('named-chunks')
    .use(NamedChunksPlugin, [
      chunk => chunk.name || chunk.modules
        .map(({ context, request }) => relative(context, request))
        .join('_')
    ])
    .end()
  .plugin('vendor-chunk')
    .use(optimize.CommonsChunkPlugin, [{ minChunks: Infinity, name: 'vendor' }])
    .end()
  .plugin('manifest-chunk')
    .use(optimize.CommonsChunkPlugin, [{ name: 'manifest' }])
    .end()
  .plugin('name-all')
    .use(NameAllModulesPlugin);
