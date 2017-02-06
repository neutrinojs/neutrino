const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  path(path) {
    return this.set('path', path);
  }

  filename(filename) {
    return this.set('filename', filename);
  }

  chunkFilename(chunkFilename) {
    return this.set('chunkFilename', chunkFilename);
  }

  publicPath(publicPath) {
    return this.set('publicPath', publicPath);
  }

  library(library) {
    return this.set('library', library);
  }

  libraryTarget(libraryTarget) {
    return this.set('libraryTarget', libraryTarget);
  }
};
