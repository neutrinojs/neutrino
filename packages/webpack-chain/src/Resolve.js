const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.modules = new ChainedSet(this);
    this.extensions = new ChainedSet(this);
  }

  toConfig() {
    return Object.assign({
      modules: this.modules.values(),
      extensions: this.extensions.values()
    }, this.entries());
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

          case 'extensions': {
            return this.extensions.merge(value);
          }

          default: {
            this.set(key, value);
          }
        }
      });

    return this;
  }
};
