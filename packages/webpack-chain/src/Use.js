const ChainedMap = require('./ChainedMap');
const merge = require('deepmerge');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend(['loader', 'options']);
  }

  tap(f) {
    this.options(f(this.get('options')));
    return this;
  }

  merge(obj) {
    if (obj.loader) {
      this.loader(obj.loader);
    }

    if (obj.options) {
      this.options(merge(this.store.get('options') || {}, obj.options));
    }

    return this;
  }

  toConfig() {
    return this.clean(this.entries() || {});
  }
};
