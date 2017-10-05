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

  merge(obj, omit = []) {
    const omissions = [
      'extensions',
      'modules',
      'moduleExtensions',
      'packageMains'
    ];

    omissions.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions]);
  }
};
