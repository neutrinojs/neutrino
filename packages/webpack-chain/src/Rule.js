const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Use = require('./Use');

module.exports = class Rule extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.uses = new ChainedMap(this);
    this.include = new ChainedSet(this);
    this.exclude = new ChainedSet(this);
    this.oneOfs = new ChainedMap(this);
    this.extend(['parser', 'test', 'enforce', 'issuer', 'resource', 'resourceQuery']);
  }

  use(name) {
    if (!this.uses.has(name)) {
      this.uses.set(name, new Use(this));
    }

    return this.uses.get(name);
  }

  oneOf(name) {
    if (!this.oneOfs.has(name)) {
      this.oneOfs.set(name, new Rule(this));
    }

    return this.oneOfs.get(name);
  }

  pre() {
    return this.enforce('pre');
  }

  post() {
    return this.enforce('post');
  }

  toConfig() {
    return this.clean(Object.assign(this.entries() || {}, {
      include: this.include.values(),
      exclude: this.exclude.values(),
      oneOf: this.oneOfs.values().map(r => r.toConfig()),
      use: this.uses.values().map(use => use.toConfig())
    }));
  }

  merge(obj) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = obj[key];

        switch (key) {
          case 'include':
          case 'exclude': {
            return this[key].merge(value);
          }

          case 'use': {
            return Object
              .keys(value)
              .forEach(name => this.use(name).merge(value[name]));
          }

          case 'oneOf': {
            return Object
              .keys(value)
              .forEach(name => this.oneOf(name).merge(value[name]))
          }

          case 'test': {
            return this.test(value instanceof RegExp ? value : new RegExp(value));
          }

          default: {
            this.set(key, value);
          }
        }
      });

    return this;
  }
};
