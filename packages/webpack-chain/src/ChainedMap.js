const Chainable = require('./Chainable');

module.exports = class extends Chainable {
  constructor(parent) {
    super(parent);
    this.store = new Map();
  }

  extend(methods) {
    this.shorthands = methods;
    methods.map(method => {
      this[method] = value => this.set(method, value);
    });
  }

  clear() {
    this.store.clear();
    return this;
  }

  delete(key) {
    this.store.delete(key);
    return this;
  }

  entries() {
    const entries = [...this.store];

    if (!entries.length) {
      return;
    }

    return entries.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  values() {
    return [...this.store.values()];
  }

  get(key) {
    return this.store.get(key);
  }

  has(key) {
    return this.store.has(key);
  }

  set(key, value) {
    this.store.set(key, value);
    return this;
  }

  merge(obj) {
    Object.keys(obj).forEach(key => this.set(key, obj[key]));
    return this;
  }

  clean(obj) {
    return Object
      .keys(obj)
      .reduce((acc, key) => {
        const value = obj[key];

        if (value === undefined) {
          return acc;
        }

        if (Array.isArray(value) && !value.length) {
          return acc;
        }

        if (Object.prototype.toString.call(value) === '[object Object]' && !Object.keys(value).length) {
          return acc;
        }

        acc[key] = value;

        return acc;
      }, {});
  }

  when(condition, trueBrancher = Function.prototype, falseBrancher = Function.prototype) {
    if (condition) {
      trueBrancher(this);
    } else {
      falseBrancher(this);
    }

    return this;
  }
};
