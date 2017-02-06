const ChainedMap = require('./ChainedMap');
const Loader = require('./Loader');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);

    this.loaders = new Map();
    this._include = new Set();
    this._exclude = new Set();
  }

  loader(name, loader, options) {
    // If we pass a function to loader, then we are trying to tap
    // into it for modification
    if (typeof loader === 'function') {
      const handler = loader;
      const instance = this.loaders.get(name);

      instance.tap(handler);
      return this;
    }

    if (this.loaders.has(name)) {
      const instance = this.loaders.get(name);

      instance.loader = loader;
      instance.options = options;
      return this;
    }

    this.loaders.set(name, new Loader(loader, options));
    return this;
  }

  test(test) {
    return this.set('test', test);
  }

  pre() {
    return this.set('enforce', 'pre');
  }

  post() {
    return this.set('enforce', 'post');
  }

  include(...paths) {
    paths.forEach(path => this._include.add(path));
    return this;
  }

  exclude(...paths) {
    paths.forEach(path => this._exclude.add(path));
  }

  toConfig() {
    const rule = this.entries();

    if (this._include.size) {
      rule.include = [...this._include];
    }

    if (this._exclude.size) {
      rule.exclude = [...this._exclude];
    }

    rule.use = [...this.loaders.values()].map(({ loader, options }) => ({ loader, options }));

    return rule;
  }
};
