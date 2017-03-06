const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const merge = require('deepmerge');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extensions = new ChainedSet(this);
    this.modules = new ChainedSet(this);
    this.moduleExtensions = new ChainedSet(this);
    this.packageMains = new ChainedSet(this);
  }

  toConfig() {
    return this.clean(Object.assign({
      extensions: this.extensions.values(),
      modules: this.modules.values(),
      moduleExtensions: this.moduleExtensions.values(),
      packageMains: this.packageMains.values()
    }, this.entries() || {}));
  }

  merge(obj) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = obj[key];

        switch (key) {
          case 'extensions':
          case 'modules':
          case 'moduleExtensions':
          case 'packageMains': {
            return this[key].merge(value);
          }

          default: {
            if (this.has(key)) {
              this.set(key, merge(this.get(key), value));
            } else {
              this.set(key, value);
            }
          }
        }
      });

    return this;
  }
};
