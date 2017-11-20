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
      oneOf: this.oneOfs.values().map(oneOf => oneOf.toConfig()),
      use: this.uses.values().map(use => use.toConfig())
    }));
  }

  merge(obj, omit = []) {
    if (!omit.includes('include') && 'include' in obj) {
      this.include.merge(obj.include);
    }

    if (!omit.includes('exclude') && 'exclude' in obj) {
      this.exclude.merge(obj.exclude);
    }

    if (!omit.includes('use') && 'use' in obj) {
      Object
        .keys(obj.use)
        .forEach(name => this.use(name).merge(obj.use[name]));
    }

    if (!omit.includes('oneOf') && 'oneOf' in obj) {
      Object
        .keys(obj.oneOf)
        .forEach(name => this.oneOf(name).merge(obj.oneOf[name]));
    }

    if (!omit.includes('test') && 'test' in obj) {
      this.test(obj.test instanceof RegExp ? obj.test : new RegExp(obj.test));
    }

    return super.merge(obj, [...omit, 'include', 'exclude', 'use', 'oneOf', 'test']);
  }
};
