module.exports = class {
  constructor(parent) {
    this.parent = parent;
  }

  end() {
    return this.parent;
  }
};
