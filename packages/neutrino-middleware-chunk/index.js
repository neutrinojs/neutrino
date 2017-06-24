const { optimize, NamedChunksPlugin, NamedModulesPlugin } = require('webpack');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const { createHash } = require('crypto');
const { relative } = require('path');

const hash = value => createHash('md5').update(value).digest('hex');

module.exports = ({ config }) => config
  .plugin('named-modules')
    .use(NamedModulesPlugin).end()
  .plugin('named-chunks')
    .use(NamedChunksPlugin, [
      chunk => (
        chunk.name ||
        hash(chunk.modules.map(({ context, request }) => relative(context || '', request || '')).join('_'))
      )
    ])
    .end()
  .plugin('vendor-chunk')
    .use(optimize.CommonsChunkPlugin, [{
      name: 'vendor',
      minChunks: Infinity
    }])
    .end()
  .plugin('runtime-chunk')
    .use(optimize.CommonsChunkPlugin, [{ name: 'runtime' }])
    .end()
  .plugin('name-all')
    .use(NameAllModulesPlugin);
