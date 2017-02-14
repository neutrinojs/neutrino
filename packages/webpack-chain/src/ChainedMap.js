const Chainable = require('./Chainable');

module.exports = class extends Chainable {
  constructor(parent) {
    super(parent);
    this.options = new Map();
  }

  clear() {
    this.options.clear();
    return this;
  }

  delete(key) {
    this.options.delete(key);
    return this;
  }

  entries() {
    const entries = [...this.options];

    if (!entries.length) {
      return;
    }

    return entries.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  values() {
    return [...this.options.values()];
  }

  get(key) {
    return this.options.get(key);
  }

  has(key) {
    return this.options.has(key);
  }

  set(key, value) {
    this.options.set(key, value);
    return this;
  }

  merge(obj) {
    Object.keys(obj).forEach(key => this.set(key, obj[key]));
    return this;
  }
};
