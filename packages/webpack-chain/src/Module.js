const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Rule = require('./Rule');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.rules = new ChainedMap(this);
    this.noParse = new ChainedSet(this);
  }

  rule(name) {
    if (!this.rules.has(name)) {
      this.rules.set(name, new Rule(this));
    }

    return this.rules.get(name);
  }

  toConfig() {
    return this.clean(Object.assign(this.entries() || {}, {
      rules: this.rules.values().map(r => r.toConfig()),
      noParse: this.noParse.values()
    }));
  }

  merge(obj) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = obj[key];

        switch (key) {
          case 'rule': {
            return Object
              .keys(value)
              .forEach(name => this.rule(name).merge(value[name]));
          }

          case 'noParse': {
            return this.noParse.merge(value);
          }

          default: {
            this.set(key, value);
          }
        }
      });

    return this;
  }
};
