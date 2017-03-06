const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend([
      'clientLogLevel',
      'compress',
      'contentBase',
      'filename',
      'headers',
      'historyApiFallback',
      'host',
      'hot',
      'hotOnly',
      'https',
      'inline',
      'lazy',
      'noInfo',
      'overlay',
      'port',
      'proxy',
      'quiet',
      'setup',
      'stats',
      'watchContentBase'
    ]);
  }
};
