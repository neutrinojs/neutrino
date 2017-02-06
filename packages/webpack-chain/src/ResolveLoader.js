const Chainable = require('./Chainable');
const ChainedSet = require('./ChainedSet');

module.exports = class extends Chainable {
  constructor(parent) {
    super(parent);
    this.modules = new ChainedSet(this);
  }

  toConfig() {
    return {
      modules: this.modules.values()
    };
  }
};
