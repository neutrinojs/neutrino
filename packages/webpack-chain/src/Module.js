const ChainedMap = require('./ChainedMap');
const Rule = require('./Rule');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.rules = new ChainedMap(this);
    this.extend(['noParse']);
  }

  rule(name) {
    if (!this.rules.has(name)) {
      this.rules.set(name, new Rule(this));
    }

    return this.rules.get(name);
  }

  toConfig() {
    return this.clean(Object.assign(this.entries() || {}, {
      rules: this.rules.values().map(r => r.toConfig())
    }));
  }

  merge(obj, omit = []) {
    if (!omit.includes('rule') && 'rule' in obj) {
      Object
        .keys(obj.rule)
        .forEach(name => this.rule(name).merge(obj.rule[name]));
    }

    return super.merge(obj, ['rule']);
  }
};
