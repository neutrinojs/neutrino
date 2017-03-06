module.exports = class {
  constructor(loader, options) {
    this.loader = loader;
    this.options = options;
  }

  tap(handler) {
    this.options = handler(this.options);
  }
};
