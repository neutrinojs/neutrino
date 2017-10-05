const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Plugin = require('./Plugin');
const merge = require('deepmerge');

module.exports = class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.alias = new ChainedMap(this);
    this.aliasFields = new ChainedSet(this);
    this.descriptionFiles = new ChainedSet(this);
    this.extensions = new ChainedSet(this);
    this.mainFields = new ChainedSet(this);
    this.mainFiles = new ChainedSet(this);
    this.modules = new ChainedSet(this);
    this.plugins = new ChainedMap(this);
    this.extend([
      'cachePredicate',
      'cacheWithContext',
      'enforceExtension',
      'enforceModuleExtension',
      'unsafeCache',
      'symlinks'
    ]);
  }

  plugin(name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new Plugin(this));
    }

    return this.plugins.get(name);
  }

  toConfig() {
    return this.clean(Object.assign(this.entries() || {}, {
      alias: this.alias.entries(),
      aliasFields: this.aliasFields.values(),
      descriptionFiles: this.descriptionFiles.values(),
      extensions: this.extensions.values(),
      mainFields: this.mainFields.values(),
      mainFiles: this.mainFiles.values(),
      modules: this.modules.values(),
      plugins: this.plugins.values().map(plugin => plugin.toConfig())
    }));
  }

  merge(obj, omit = []) {
    const omissions = [
      'alias',
      'aliasFields',
      'descriptionFiles',
      'extensions',
      'mainFields',
      'mainFiles',
      'modules',
      'plugins'
    ];

    omissions.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions]);
  }
};
