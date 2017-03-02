const path = require('path');
const EventEmitter = require('events').EventEmitter;
const DevServer = require('webpack-dev-server');
const webpack = require('webpack');
const Config = require('webpack-chain');
const ora = require('ora');

class Neutrino extends EventEmitter {
  constructor(options) {
    super();
    this.config = new Config();
    this.options = options;
  }

  use(preset, options = {}) {
    preset(this, options);
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

  getWebpackOptions() {
    if (this.__configCache) {
      return this.__configCache;
    }

    return this.__configCache = this.config.toConfig();
  }

  emitForAll(eventName, payload) {
    return Promise.all(this.listeners(eventName).map(fn => fn(payload)));
  }

  build(args) {
    return this
      .emitForAll('prebuild', args)
      .then(() => this.builder())
      .then(() => this.emitForAll('build', args));
  }

  start(args) {
    return this
      .emitForAll('prestart', args)
      .then(() => {
        const config = this.getWebpackOptions();

        if (config.devServer) {
          return this.devServer();
        }

        if (config.target === 'node') {
          console.log('Warning: This preset does not support watch compilation. Falling back to a one-time build.');
          return this.builder();
        }

        return this.watcher();
      })
      .then(() => this.emitForAll('start', args));
  }

  test(args) {
    return this
      .emitForAll('pretest', args)
      .then(() => this.emitForAll('test', args));
  }

  devServer() {
    return new Promise(resolve => {
      const starting = ora('Starting development server').start();
      const config = this.getWebpackOptions();
      const protocol = config.devServer.https ? 'https' : 'http';
      const host = config.devServer.host || 'localhost';
      const port = config.devServer.port || 5000;

      config.devServer.noInfo = true;

      const compiler = webpack(config);
      const server = new DevServer(compiler, config.devServer);
      const building = ora('Waiting for initial build to finish').start();

      process.on('SIGINT', resolve);
      server.listen(port, host, () => {
        starting.succeed(`Development server running on: ${protocol}://${host}:${port}`);
        compiler.plugin('compile', () => {
          building.text = 'Source changed, re-compiling';
          building.start();
        });
        compiler.plugin('done', () => building.succeed('Build completed'));
      });
    });
  }

  watcher() {
    return new Promise(resolve => {
      const config = this.getWebpackOptions();
      const compiler = webpack(config);
      const watcher = compiler.watch(config.watchOptions || {}, (err, stats) => {
        this.handleErrors(err, stats);
      });

      process.on('SIGINT', () => watcher.close(resolve));
    });
  }

  builder() {
   return new Promise((resolve, reject) => {
     const config = this.getWebpackOptions();
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
   });
  }
}

module.exports = Neutrino;
