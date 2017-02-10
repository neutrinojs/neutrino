const path = require('path');
const EventEmitter = require('events').EventEmitter;
const merge = require('webpack-merge').smart;
const DevServer = require('webpack-dev-server');
const webpack = require('webpack');

const cwd = process.cwd();
const noop = Function.prototype;

module.exports = class Neutrino extends EventEmitter {
  constructor(presets) {
    super();
    this.configs = [];
    this.__configCache = null;
    this.custom = {};

    presets.map(p => this.loadPreset(p));
  }

  loadPreset(name) {
    const paths = [
      path.join(cwd, name),
      path.join(cwd, 'node_modules', name),
      name
    ];

    for (let i = 0; i < paths.length; i++) {
      try {
        const preset = require(paths[i])(this);

        if (preset) {
          this.configs.push(preset);
        }

        return;
      } catch (err) {
        if (!/Cannot find module/.test(err.message)) {
          throw err;
        }
      }
    }

    throw new Error(`Unable to locate preset "${name}"`);
  }

  handleErrors(err, stats) {
    if (err) {
      console.error(err.stack || err);

      if (err.details) {
        console.error(err.details);
      }

      return true;
    }

    const jsonStats = stats.toJson();

    if (jsonStats.errors.length) {
      jsonStats.errors.map(err => console.error(err));
      return true;
    }

    return false;
  }

  getConfig() {
    if (this.__configCache) {
      return this.__configCache;
    }

    return this.__configCache = merge(...this.configs.map(c => 'toConfig' in c ? c.toConfig() : c));
  }

  emitForAll(eventName, payload) {
    const config = this.getConfig();

    return Promise.all(this.listeners(eventName).map(fn => fn(config, payload)));
  }

  build(args) {
    return this
      .emitForAll('prebuild')
      .then(() => new Promise((resolve, reject) => {
        const config = this.getConfig();
        const compiler = webpack(config);

        compiler.run((err, stats) => {
          const failed = this.handleErrors(err, stats);

          if (failed) {
            return reject();
          }

          console.log(stats.toString({
            colors: true,
            chunks: false,
            children: false
          }));

          resolve();
        });
      }))
      .then(() => this.emitForAll('build'));
  }

  start(args) {
    return this
      .emitForAll('prestart')
      .then(() => {
        const config = this.getConfig();

        if (config.devServer) {
          return this._devServer();
        }

        if (config.target === 'node') {
          console.log('Warning: This preset does not support watch compilation. Falling back to a one-time build.');
          return this.build();
        }

        return new Promise(resolve => {
          const config = this.getConfig();
          const compiler = webpack(config);
          const watcher = compiler.watch(config.watchOptions || {}, (err, stats) => {
            this.handleErrors(err, stats);
          });

          process.on('SIGINT', () => watcher.close(resolve));
        });
      })
      .then(() => this.emitForAll('start'));
  }

  _devServer() {
    return new Promise(resolve => {
      const config = this.getConfig();
      const protocol = config.devServer.https ? 'https' : 'http';
      const host = config.devServer.host || 'localhost';
      const port = config.devServer.port || 5000;

      const compiler = webpack(config);
      const server = new DevServer(compiler, config.devServer);

      process.on('SIGINT', resolve);

      server.listen(port, host, () => {
        console.log(`Dev server started at ${protocol}://${host}:${port}`);
        console.log('Waiting for initial build to finish...');
      });
    });
  }

  test(args) {
    return this
      .emitForAll('pretest', args)
      .then(() => this.emitForAll('test', args));
  }

  extend(source, extender) {
    return extender(source(this));
  }
};
