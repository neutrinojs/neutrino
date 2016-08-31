'use strict';

const getPreset = require('../../src/get-preset');
const DevServer = require('webpack-dev-server');
const webpack = require('webpack');

const build = (config, done) => {
  webpack(config, (err, stats) => {
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

const watch = (config, done) => {
  const protocol = config.devServer.https ? 'https' : 'http';
  const host = config.devServer.host || 'localhost';
  const port = config.devServer.port || 5000;
  const compiler = webpack(config);
  const server = new DevServer(compiler, config.devServer);

  process.on('SIGINT', done);
  server.listen(port, host, () => console.log(`Listening on ${protocol}://${host}:${port}`));
};

module.exports = (args, done) => {
  const config = getPreset(args.options.preset);

  if (process.env.NODE_ENV === 'production') {
    return build(config, done);
  }

  // If we can't start a development server, just do a build,
  // which is currently the case for Node.js packages since we
  // don't have HMR implemented
  if (!config.devServer || config.target === 'node') {
    console.log('Warning: This preset does not support watch compilation. Falling back to a one-time build.');
    return build(config, done);
  }

  watch(config, done);
};

