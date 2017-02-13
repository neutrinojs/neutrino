const ChainedMap = require('./ChainedMap');

module.exports = class extends ChainedMap {
  host(host) {
    return this.set('host', host);
  }

  port(port) {
    return this.set('port', port);
  }

  https(isHttps) {
    return this.set('https', isHttps);
  }

  contentBase(contentBase) {
    return this.set('contentBase', contentBase);
  }

  historyApiFallback(useHistoryApiFallback) {
    return this.set('historyApiFallback', useHistoryApiFallback);
  }

  hot(hot) {
    return this.set('hot', hot);
  }

  stats(stats) {
    return this.set('stats',  stats);
  }
};
