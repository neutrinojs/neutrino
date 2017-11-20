const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend([
      'auxiliaryComment',
      'chunkFilename',
      'chunkLoadTimeout',
      'crossOriginLoading',
      'devtoolFallbackModuleFilenameTemplate',
      'devtoolLineToLine',
      'devtoolModuleFilenameTemplate',
      'filename',
      'hashDigest',
      'hashDigestLength',
      'hashFunction',
      'hashSalt',
      'hotUpdateChunkFilename',
      'hotUpdateFunction',
      'hotUpdateMainFilename',
      'jsonpFunction',
      'library',
      'libraryExport',
      'libraryTarget',
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
