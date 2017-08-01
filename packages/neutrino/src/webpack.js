const Future = require('fluture');
const { isEmpty, pathOr, pipe } = require('ramda');
const webpack = require('webpack');
const DevServer = require('webpack-dev-server');
const { toArray } = require('./utils');

// errors :: (Error|Array Error err -> Object stats) -> Array Error
const getErrors = (err, stats) => (err ? toArray(err) : stats.toJson().errors);

// compiler :: Object config -> Future Error Object
const compiler = pipe(Future.of, Future.ap(Future.of(webpack)));

// compile :: Object config -> Future Error Object
const compile = pipe(
  compiler,
  Future.chain(compiler => Future((reject, resolve) => {
    compiler.run((err, stats) => {
      const errors = getErrors(err, stats);

      isEmpty(errors) ? resolve(stats) : reject(errors);
    });
  }))
);

// devServer :: Object config -> Future Error Object
const devServer = pipe(
  compiler,
  Future.map(compiler => Object.assign(new DevServer(compiler, compiler.options.devServer), { compiler }))
);

// serve :: Object config -> Future Error Object
const serve = pipe(
  devServer,
  Future.chain(server => Future((reject, resolve) => {
    const { compiler } = server;
    const { host, port } = compiler.options.devServer;

    server.listen(port, host, () => resolve(compiler));
  }))
);

// validator :: Object config -> Future Error Object
const validator = pipe(Future.of, Future.ap(Future.of(webpack.validate)));

// validate :: Object config -> Future Error Object
const validate = config => validator(config)
  .chain(errors => (isEmpty(errors) ?
    Future.of(config) :
    Future.reject([new webpack.WebpackOptionsValidationError(errors)])));

// watch :: Object config -> Future Error Object
const watcher = pipe(
  compiler,
  Future.chain(compiler => Future((reject, resolve) => {
    const watchOptions = pathOr({}, ['options', 'watchOptions'], compiler);

    compiler.watch(watchOptions, (err, stats) => {
      const errors = getErrors(err, stats);

      isEmpty(errors) ? resolve(compiler) : reject(errors);
    });
  }))
);

module.exports = {
  getErrors,
  compiler,
  compile,
  devServer,
  serve,
  validator,
  validate,
  watcher
};
