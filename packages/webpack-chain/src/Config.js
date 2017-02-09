const ChainedMap = require('./ChainedMap');
const ChainedSet = require('./ChainedSet');
const Resolve = require('./Resolve');
const ResolveLoader = require('./ResolveLoader');
const Output = require('./Output');
const DevServer = require('./DevServer');
const Plugin = require('./Plugin');
const Module = require('./Module');

module.exports = class {
  constructor() {
    this.options = new ChainedMap(this);
    this.node = new ChainedMap(this);
    this.output = new Output(this);
    this.plugins = new ChainedMap(this);
    this.resolve = new Resolve(this);
    this.resolveLoader = new ResolveLoader(this);
    this.entries = new ChainedMap(this);
    this.devServer = new DevServer(this);
    this.module = new Module(this);
  }

  externals(externals) {
    this.options.set('externals', externals);
  }

  devtool(devtool) {
    this.options.set('devtool', devtool);
    return this;
  }

  context(context) {
    this.options.set('context', context);
    return this;
  }

  target(target) {
    this.options.set('target', target);
    return this;
  }

  entry(name) {
    if (!this.entries.has(name)) {
      this.entries.set(name, new ChainedSet(this));
    }

    return this.entries.get(name);
  }

  plugin(name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new Plugin(this));
    }

    return this.plugins.get(name);
  }

  toConfig() {
    const entries = this.entries.entries();
    const config = Object.assign({}, this.options.entries(), {
      node: this.node.entries(),
      output: this.output.entries(),
      resolve: this.resolve.toConfig(),
      resolveLoader: this.resolveLoader.toConfig(),
      devServer: this.devServer.entries(),
      plugins: this.plugins.values().map(value => value.init(value.plugin, value.args)),
      module: this.module.toConfig(),
      entry: entries && Object
        .keys(entries)
        .reduce((acc, key) => {
          acc[key] = entries[key].values();
          return acc;
        }, {})
    });

    return Object
      .keys(config)
      .reduce((acc, key) => {
        if (config[key] !== undefined) {
          acc[key] = config[key];
        }

        return acc;
      }, {});
  }
};
