module.exports = class {
  constructor(loader, options) {
    this.loader = loader;
    this.options = options;
  }

  tap(handler) {
    const {
      loader = this.loader,
      options = this.options
    } = handler({ loader: this.loader, options: this.options });

    this.loader = loader;
    this.options = options;
  }
};
