const Neutrino = require('./api');
const { partial } = require('ramda');
const Future = require('fluture');
const { getNodeEnv, toArray } = require('./utils');

// run :: (String command -> Array middleware -> Object options) -> Future Error a
const run = (command, middleware, options) => {
  const api = Neutrino(options);

  process.env.NODE_ENV = getNodeEnv(command, api.options.args && api.options.args.env);

  // Require and use all middleware
  return api.requiresAndUses(middleware)
    // Also grab any config overrides and merge it into the config at a higher precedence
    .map(() => api.config.merge(options.config))
    // Trigger all pre-events for the current command
    .chain(() => Future.fromPromise2(api.emitForAll, `pre${command}`, api.options.args))
    // Execute the command
    .chain(() => api.run(command))
    // Trigger all post-command events, resolving with the value of the command execution
    .chain(value => Future
      .fromPromise2(api.emitForAll, command, api.options.args)
      .chain(() => Future.of(value)))
    .mapRej(toArray);
};

// build :: (Array middleware -> Object options) -> Future Error a
const build = partial(run, ['build']);

// inspect :: (Array middleware -> Object options) -> Future Error a
const inspect = partial(run, ['inspect']);

// start :: (Array middleware -> Object options) -> Future Error a
const start = partial(run, ['start']);

// test :: (Array middleware -> Object options) -> Future Error a
const test = partial(run, ['test']);

module.exports = {
  Neutrino,
  run,
  build,
  start,
  test,
  inspect(middleware, options = {}) {
    return options.customInspect ? this : inspect(middleware, options);
  }
};
