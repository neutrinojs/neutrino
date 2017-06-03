const { CommonsChunkPlugin } = require('webpack').optimize;
const ChunkHashPlugin = require('webpack-chunk-hash');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const merge = require('deepmerge');

module.exports = ({ config }, options) => config
  .plugin('chunk')
    .use(CommonsChunkPlugin, [
      merge({ minChunks: Infinity, names: ['vendor', 'manifest'] }, options.commons || {})
    ])
    .end()
  .plugin('chunk-hash')
    .use(ChunkHashPlugin)
    .end()
  .plugin('chunk-manifest')
    .use(ChunkManifestPlugin, [
      merge({
        filename: 'chunk-manifest.json',
        manifestVariable: 'webpackManifest'
      }, options.manifest || {})
    ]);
