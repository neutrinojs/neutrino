const { CommonsChunkPlugin } = require('webpack').optimize;
const merge = require('deepmerge');

module.exports = ({ config }, options) => config
  .plugin('chunk')
  .use(CommonsChunkPlugin, [
    merge({ minChunks: Infinity, names: ['vendor', 'manifest'] }, options)
  ]);
