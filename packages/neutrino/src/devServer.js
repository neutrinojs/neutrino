const merge = require('deepmerge');
const DevServer = require('webpack-dev-server');
const Future = require('fluture');
const { createWebpackCompiler, validateWebpackConfig } = require('./utils');

// devServer :: Object config -> Future () Function
const devServer = config => Future
  .of(merge({ devServer: { host: 'localhost', port: 5000, noInfo: true } }, config))
  .chain(validateWebpackConfig)
  .chain(createWebpackCompiler)
  .chain(compiler => Future((reject, resolve) => {
    const { devServer } = compiler.options;
    const { host, port } = devServer;
    const server = new DevServer(compiler, devServer);

    server.listen(port, host, () => resolve(compiler));
  }));

module.exports = devServer;
