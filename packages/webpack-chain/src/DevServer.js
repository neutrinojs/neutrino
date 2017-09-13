const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const merge = require('deepmerge');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);

    this.allowedHosts = new ChainedSet(this);

    this.extend([
      'bonjour',
      'clientLogLevel',
      'color',
      'compress',
      'contentBase',
      'disableHostCheck',
      'filename',
      'headers',
      'historyApiFallback',
      'host',
      'hot',
      'hotOnly',
      'https',
      'info',
      'inline',
      'lazy',
      'noInfo',
      'open',
      'openPage',
      'overlay',
      'pfx',
      'pfxPassphrase',
      'port',
      'proxy',
      'progress',
      'public',
      'publicPath',
      'quiet',
      'setup',
      'socket',
      'staticOptions',
      'stats',
      'stdin',
      'useLocalIp',
      'watchContentBase',
      'watchOptions'
    ]);
  }

  toConfig() {
    return this.clean(Object.assign({
      allowedHosts: this.allowedHosts.values(),
    }, this.entries() || {}));
  }

  merge(obj) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = obj[key];

        switch (key) {
          case 'allowedHosts': {
            return this[key].merge(value);
          }

          default: {
            if (this.has(key)) {
              this.set(key, merge(this.get(key), value));
            } else {
              this.set(key, value);
            }
          }
        }
      });

    return this;
  }
};
