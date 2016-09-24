'use strict';

const getPreset = require('../../src/get-preset');
const DevServer = require('webpack-dev-server');
const webpack = require('webpack');

const build = (config, done) => {
  const compiler = webpack(config);

  compiler.run((err, stats) => {
    if (!err) {
      console.log(stats.toString({ colors: true }));
    } else {
      console.error(err.stack || err);

      if (err.details) {
        console.error(err.details);
      }
    }

    done();
  });
};

const watch = (config, handler, done) => {
  const compiler = webpack(config);
  const watcher = compiler.watch(config.watchOptions || {}, (err, stats) => {
    if (!err) {
      return handler();
    }

    console.error(err.stack || err);

    if (err.details) {
      console.error(err.details);
    }
  });

  process.on('SIGINT', () => watcher.close(done));
};

const devServer = (config, done) => {
  const protocol = config.devServer.https ? 'https' : 'http';
  const host = config.devServer.host || 'localhost';
  const port = config.devServer.port || 5000;
  const compiler = webpack(config);
  const server = new DevServer(compiler, config.devServer);

  process.on('SIGINT', done);
  server.listen(port, host, () => {
    console.log(`Dev server started at ${protocol}://${host}:${port}`);
    console.log('Waiting for initial build to finish...');
  });
};

module.exports = (args, done) => {
  const config = getPreset(args.options.preset);

  if (process.env.NODE_ENV === 'production') {
    return build(config, done);
  }

  // If we can't start a development server, just do a build,
  // which is currently the case for Node.js packages since we
  // don't have HMR implemented
  // TODO: look into https://github.com/housinghq/warm-require
  if (!config.devServer || config.target === 'node') {
    console.log('Warning: This preset does not support watch compilation. Falling back to a one-time build.');
    return build(config, done);
  }

  devServer(config, done);
};

module.exports.build = build;
module.exports.devServer = devServer;
module.exports.watch = watch;
