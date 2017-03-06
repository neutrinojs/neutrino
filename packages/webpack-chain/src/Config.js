const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Resolve = require('./Resolve');
const ResolveLoader = require('./ResolveLoader');
const Output = require('./Output');
const DevServer = require('./DevServer');
const Plugin = require('./Plugin');
const Module = require('./Module');
const Performance = require('./Performance');

module.exports = class extends ChainedMap {
  constructor() {
    super();
    this.devServer = new DevServer(this);
    this.entryPoints = new ChainedMap(this);
    this.module = new Module(this);
    this.node = new ChainedMap(this);
    this.output = new Output(this);
    this.performance = new Performance(this);
    this.plugins = new ChainedMap(this);
    this.resolve = new Resolve(this);
    this.resolveLoader = new ResolveLoader(this);
    this.extend([
      'amd',
      'bail',
      'cache',
      'devtool',
      'context',
      'externals',
      'loader',
      'profile',
      'recordsPath',
      'recordsInputPath',
      'recordsOutputPath',
      'stats',
      'target',
      'watch',
      'watchOptions'
    ]);
  }

  entry(name) {
    if (!this.entryPoints.has(name)) {
      this.entryPoints.set(name, new ChainedSet(this));
    }

    return this.entryPoints.get(name);
  }

  plugin(name, plugin, ...args) {
    if (this.plugins.has(name)) {
      const handler = plugin;
      const instance = this.plugins.get(name);

      instance.tap(handler);
      return this;
    }

    this.plugins.set(name, new Plugin(plugin, args));
    return this;
  }

  toConfig() {
    const entries = this.entryPoints.entries();
    const plugins = this.plugins.values().map(plugin => plugin.init(plugin.plugin, plugin.args));

    const config = Object.assign(this.entries() || {}, {
      node: this.node.entries(),
      output: this.output.entries(),
      resolve: this.resolve.toConfig(),
      resolveLoader: this.resolveLoader.toConfig(),
      devServer: this.devServer.entries(),
      module: this.module.toConfig(),
      entry: entries && Object
        .keys(entries)
        .reduce((acc, key) => {
          acc[key] = entries[key].values();
          return acc;
        }, {})
    });

    if (plugins.length) {
      config.plugins = plugins;
    }

    return this.clean(config);
  }

  merge(obj = {}) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = obj[key];

        switch (key) {
          case 'node':
          case 'output':
          case 'resolve':
          case 'resolveLoader':
          case 'devServer':
          case 'module': {
            return this[key].merge(value);
          }

          case 'entry': {
            return Object
              .keys(value)
              .forEach(name => this.entry(name).merge(value[name]));
          }

          case 'plugin': {
            return Object
              .keys(value)
              .forEach(name => this.plugins.get(name).merge(value[name]));
          }

          default: {
            this.options.set(key, value);
          }
        }
      });

    return this;
  }
};
