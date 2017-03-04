const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.modules = new ChainedSet(this);
  }

  toConfig() {
    const modules = this.modules.values();
    const entries = this.entries() || {};

    if (!modules.length && !Object.keys(entries).length) {
      return;
    }

    return Object.assign({ modules }, entries);
  }

  merge(obj) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = obj[key];

        switch (key) {
          case 'modules': {
            return this.modules.merge(value);
          }

          default: {
            this.set(key, value);
          }
        }
      });

    return this;
  }
};
