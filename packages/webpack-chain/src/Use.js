const ChainedMap = require('./ChainedMap');
const Orderable = require('./Orderable');
const merge = require('deepmerge');

module.exports = Orderable(class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend(['loader', 'options']);
  }

  tap(f) {
    this.options(f(this.get('options')));
    return this;
  }

  merge(obj, omit = []) {
    if (!omit.includes('loader') && 'loader' in obj) {
      this.loader(obj.loader);
    }

    if (!omit.includes('options') && 'options' in obj) {
      this.options(merge(this.store.get('options') || {}, obj.options));
    }

    return super.merge(obj, [...omit, 'loader', 'options']);
  }

  toConfig() {
    return this.clean(this.entries() || {});
  }
});
