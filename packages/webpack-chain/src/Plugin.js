const Chainable = require('./Chainable');

module.exports = class extends Chainable {
  constructor(parent) {
    super(parent);
    this.args = [];
  }

  init(Plugin, args) {
    if (typeof Plugin === 'function') {
      return new Plugin(...args);
    }

    return Plugin;
  }

  use(plugin, ...args) {
    this.plugin = plugin;
    this.args = args;
  }

  inject(handler) {
    this.init = handler;
  }
};
