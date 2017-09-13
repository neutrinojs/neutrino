const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend([
      'chunkFilename',
      'crossOriginLoading',
      'filename',
      'library',
      'libraryExport',
      'libraryTarget',
      'devtoolFallbackModuleFilenameTemplate',
      'devtoolLineToLine',
      'devtoolModuleFilenameTemplate',
      'hashFunction',
      'hashDigest',
      'hashDigestLength',
      'hashSalt',
      'hotUpdateChunkFilename',
      'hotUpdateFunction',
      'hotUpdateMainFilename',
      'jsonpFunction',
      'path',
      'pathinfo',
      'publicPath',
      'sourceMapFilename',
      'sourcePrefix',
      'strictModuleExceptionHandling',
      'umdNamedDefine'
    ]);
  }
};
