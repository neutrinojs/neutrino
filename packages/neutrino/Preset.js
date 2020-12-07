const path = require('path');

class Preset {
  constructor(options) {
    this.path = options.path;
    this.extends = options.extends;
    this.use = options.use;
    this.options = options.options;
    this.restOptions = options.restOptions
  }

  static create(params = Preset.defaultPreset) {
    let preset = Preset.loadCacheMap.get(params);

    if (preset) {
      return preset;
    }

    if (typeof params === 'function') {
      preset = Preset.createFromFunction(params);
    } else if (typeof params === 'object') {
      preset = Preset.createFromObject(params);
    } else if (typeof params === 'string') {
      preset = Preset.createFromString(params);
    }

    Preset.loadCacheMap.set(params, preset);

    return preset;
  }

  static createFromString(filePath) {
    return Preset.createFromObject(Preset.load(filePath), filePath);
  }

  static createFromFunction(fn) {
    return Preset.createFromObject({
      ...fn,
      use: [fn],
    });
  }

  static createFromObject(config, filePath = '') {
    const instanceLike = Object.assign({}, Preset.defaultOptions, config);
    const { extends: parent, use, options, ...restOptions } = instanceLike;
    const uses = (Array.isArray(use) ? use : [use]).map(Preset.load);

    const presetInstance = new Preset({
      restOptions,
      path: filePath,
      extends: !parent ? null : Preset.create(parent),
      use: uses,
      options,
    });

    return presetInstance;
  }

  static load(filePath) {
    if (typeof filePath !== 'string') {
      return filePath;
    }
    if (path.isAbsolute(filePath)) {
      return require(filePath);
    }
    return require(require.resolve(filePath));
  }

  static getExports(preset) {
    return {
      ...Preset.getRestOptions(preset),
      options: Preset.getOptions(preset),
      use: Preset.getUse(preset),
    };
  }

  static getUse(preset) {
    if (!preset.extends) {
      return preset.use;
    }
    return [].concat(Preset.getUse(preset.extends)).concat(preset.use);
  }

  static getOptions(preset) {
    if (!preset.extends) {
      return preset.options;
    }
    return Object.assign({}, Preset.getOptions(preset.extends), preset.options);
  }

  static getRestOptions(preset) {
    if (!preset.extends) {
      return preset.restOptions;
    }
    return Object.assign({}, Preset.getRestOptions(preset.extends), preset.restOptions);
  }
};

Preset.loadCacheMap = new Map();

Preset.defaultOptions = {
  extends: null,
  use: [],
  options: {}
};

Preset.defaultPreset = path.join(process.cwd(), '.neutrinorc.js')

module.exports = Preset