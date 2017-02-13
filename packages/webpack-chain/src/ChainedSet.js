const Chainable = require('./Chainable');

module.exports = class extends Chainable {
  constructor(parent) {
    super(parent);
    this.collection = new Set();
  }

  add(value) {
    this.collection.add(value);
    return this;
  }

  prepend(value) {
    this.collection = new Set([value, ...this.collection]);
    return this;
  }

  clear() {
    this.collection.clear();
    return this;
  }

  delete(value) {
    this.collection.delete(value);
    return this;
  }

  values() {
    return [...this.collection];
  }

  has(value) {
    return this.collection.has(value);
  }
};
