# Neutrino API

When using Neutrino via the [CLI](../cli/README.md), it creates an instance of the Neutrino API which picks up
any middleware and arguments passed on the command line or located in your `.neutrinorc.js`. If you desire, you can
also create your own instance of the Neutrino API and interact with it programmatically.

## Importing

The default export of the Neutrino module is an object with the core Neutrino API, along with available
built-in functions for the API to run:

```js
const {
  Neutrino,
  build,
  inspect,
  start,
  test
} = require('neutrino');
```

The `Neutrino` function is the lowest-level API, and each of the other methods can be used with the Neutrino
API for executing their functionality. First, we will cover the `Neutrino` API and
later showing how to use the runnable functions.

## Instantiation

In order to access the Neutrino API, you must require or import it and invoke it, passing in any
options:

Using `require`:

```js
const { Neutrino } = require('neutrino');

const neutrino = Neutrino(options);
```

Using ES imports:

```js
import { Neutrino } from 'neutrino';

const neutrino = Neutrino(options);
```

## API options

The Neutrino function can accept an object for setting a number of useful options.

### Path options

The path options mentioned afterwards are generated using JavaScript object getters and setters, meaning their
assignment and access will produce a computed value each time. For example, the value set for `options.source` may not
be the same as the value retrieved, as they will be path-normalized to absolute paths:

```js
api.options.source = 'lib';
console.log(api.options.source); //   /project/lib
```

```js
api.options.entry = 'app.js';
console.log(api.options.entry); //   /project/src/app.js
api.options.source = 'lib';
console.log(api.options.entry); //   /project/lib/app.js
```

### `options.root`

Set the base directory which Neutrino middleware and presets operate on. Typically this is the project directory where
the package.json would be located. If the option is not set, Neutrino defaults it to `process.cwd()`. If a relative
path is specified, it will be resolved relative to `process.cwd()`; absolute paths will be used as-is.

```js
Neutrino({
  // if not specified, defaults to process.cwd()

  // relative, resolves to process.cwd() + website
  root: 'website',

  // absolute
  root: '/code/website'
})
```

### `options.source`

Set the directory which contains the application source code. If the option is not set, Neutrino defaults it to `src`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
Neutrino({
  // if not specified, defaults to options.root + src

  // relative, resolves to options.root + lib
  source: 'lib',

  // absolute
  source: '/code/website/lib'
})
```

### `options.output`

Set the directory which will be the output of built assets. If the option is not set, Neutrino defaults it to `build`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
Neutrino({
  // if not specified, defaults to options.root + build

  // relative, resolves to options.root + dist
  output: 'dist',

  // absolute
  output: '/code/website/dist'
})
```

### `options.tests`

Set the directory that contains test files. If the option is not set, Neutrino defaults it to `test`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
Neutrino({
  // if not specified, defaults to options.root + test

  // relative, resolves to options.root + testing
  tests: 'testing',

  // absolute
  tests: '/code/website/testing'
})
```

### `options.entry`

Set the main entry point for the application. If the option is not set, Neutrino defaults it to `index.*` - the
extension is resolved by Webpack. The main file by default is not required to be in JavaScript format. If a relative
path is specified, it will be resolved relative to `options.source`; absolute paths will be used as-is.

```js
Neutrino({
  // if not specified, defaults to options.source + index

  // relative, resolves to options.source + entry.js
  entry: 'entry.js',

  // absolute
  entry: '/code/website/src/entry.js'
})
```

### `options.static`

Designate a directory within `source` for containing static/non-compiled assets. If the option is not set, Neutrino
defaults it to `static`. If a relative path is specified, it will be resolved relative to `options.source`; absolute
paths will be used as-is (not recommended).

```js
Neutrino({
  // if not specified, defaults to options.source + static

  // relative, resolves to options.source + public
  static: 'public',

  // absolute
  static: '/code/website/src/public'
})
```

### `options.node_modules`

Set the directory which contains the Node.js modules of the project. If the option is not set, Neutrino defaults it to
`node_modules`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be
used as-is.

```js
Neutrino({
  // if not specified, defaults to options.root + node_modules

  // relative, resolves to options.root + modules
  node_modules: 'modules',

  // absolute
  node_modules: '/code/website/modules'
})
```

## Other options

### `options.debug`

Informs interested middleware that they should be in a state of debugging. This does not currently make Neutrino itself
behave any differently, rather it can be used to inform middleware to behave differently, by outputting console
information, inspecting processes, or changing configuration which is helpful for debugging.

### `options.env`

When using the CLI and the higher-level API functions, environment variables are automatically set based on the command
you are using. When using the `Neutrino` low-level API this is not the case, and you should specify an `env` option
to the API prior to calling any build commands or loading any middleware if you expect them to build correctly based on
their environment target.

Use `options.env` to set environment variables and make them available to middleware for conditional operations.

```js
Neutrino({
  env: {
    NODE_ENV: 'production'
  }
});

process.env.NODE_ENV // "production"
```

## Neutrino API

When creating a Neutrino instance, you have the option of providing an object which can be passed as options to
middleware as `neutrino.options`.

```js
const { Neutrino } = require('neutrino');

const neutrino = Neutrino();

// or with optional options
const neutrino = Neutrino({ output: 'dist' });
```

### `options`

An object containing various properties for the benefit of the API and middleware. This can contain
options set by both Neutrino and any included middleware.

### `config`

When constructing a Neutrino instance, a property of `config` is set to be a new instance of
[webpack-chain](https://github.com/mozilla-neutrino/webpack-chain). This property is then available to all middleware
which subsequently augment it with their specific configuration. All middleware and presets added use this single
`config` to store their data, meaning that middleware load order has an effect on which config values take precedence.
Middleware loaded first will have any configuration overridden by later middleware with matching properties.

### `use(middlewareFormat)`

Use a Neutrino middleware format, optionally providing options which will be passed to the middleware.
Middleware functions will be invoked with two arguments:

1. The Neutrino API instance
2. Any middleware options argument passed to `use`.

#### Manually loading middleware with `use`

Using the Neutrino API you can load [middleware](../middleware/README.md) and presets (which are also just middleware)
using the `use` method. The `use` method takes in a middleware format and optionally any options that should be
passed to the middleware. See [middleware formats](../middleware/README.md#formats) for details on the different ways to
specify middleware.

```js
/**
* use::
*   (Function, Object)
*   (String, Object)
*   (Array [Middleware, Object])
*   (Object)
*/
// use :: (Function, Object)
neutrino.use(neutrino => { /* ... */ }, { /* options */ })

// use :: (String, Object)
neutrino.use('middleware', { /* options */ })

// use :: (Array [Middleware, Object])
neutrino.use(['middleware', { /* options */ }])

// use :: (Object)
neutrino.use({
  options: { /* ... */ },
  use: [
    // ...even more middleware
  ]
})
```

Any `options` passed to a middleware _object format_ will be set on the Neutrino API instance prior to consuming any
middleware in the `use` array.

### `emitForAll(eventName, payload)`

Trigger a Promise-dependent event. For example, calling `emitForAll('build')` will trigger an event named build, and
each event handler can return a Promise denoting when it is finished. When all events have finished, this call will
resolve.

This method returns a Promise which resolves when all event handlers have also resolved.

```js
api
  .emitForAll('custom-event')
  .then(() => console.log('All custom-events have resolved!'));
```

By passing an additional argument for `payload`, you can pass custom data to all the event handlers

```js
api.emitForAll('custom-event', { custom: 'payload' });

// ...

neutrino.on('custom-event', (args, payload) => {
  console.log(payload.custom); // "payload"
});
```

### `config.toConfig()`

While tools like webpack-chain provide a convenient API for creating Webpack configurations, this is not a format that
is understandable by Webpack. With `config.toConfig()`, the webpack-chain instance at `config` will be converted to
a configuration object readable directly by Webpack.

```js
api.config.toConfig(); // -> { ... }
```

### `register(command, handler)`

This method registers a new command which can be run from the API at a later time. This function takes two
arguments: a String command name, and a Function which accepts a Webpack configuration and the API. The return value of
`handler` depends on the expected usage of the command.

The handler function can accept two arguments:

1. A Webpack configuration object. This is the result of calling `api.config.toConfig()`, and represents a
Webpack-usable object
2. The Neutrino API instance

_Example: add a new runnable command which resolves with a JSON-formatted Webpack configuration:`

```js
api.register('jsonify', config => JSON.stringify(config, null, 2));
```

The registered command can be triggered from `call()`, `run()`, or via the CLI.

### `require(moduleId)`

This method is typically used internally by the Neutrino API to attempt to require a string module ID in various paths
before failing. Takes a String `moduleId` and returns the first exports of the module it is able to require. This
will throw an exception if Neutrino is unable to require the specified module ID in any of its know paths.

### `call(commandName, middleware)`

This API method will invoke a command function that has been previously defined by the `register` method after
consuming any specified middleware. The `commandName` argument should be a String, and optionally `middleware`
should be an Array of middleware formats. If `middleware` is not specified, Neutrino will load middleware from the
local `.neutrinorc.js` file.

The `call` method will invoke the registered command with two arguments: a Webpack configuration object, and the
instance of the Neutrino API. The return value of using `call` will be the return value of invoking the registered
handler with these two arguments.

For a concrete example, the [eslint middleware](../middleware/neutrino-middleware-eslint) registers an `eslintrc`
command. The results of this command can be returned with `call` (provided this middleware is loaded within
`.neutrinorc.js` in this example):

```js
const { Neutrino } = require('neutrino');

const eslintConfig = Neutrino().call('eslintrc');
```

### `run(commandName, middleware)`

This API method will invoke a command function that has been previously defined by the `register` method after
consuming any specified middleware. The `commandName` argument should be a String, and optionally `middleware`
should be an Array of middleware formats. If `middleware` is not specified, Neutrino will load middleware from the
local `.neutrinorc.js` file.

The Neutrino package exports functions to automate key parts of interacting with the Neutrino API, and they are named
`build`, `inspect`, `start`, and `test`. These are functions that are invoked when using the CLI.

Every runnable command performs the following flow:

- Requires and `use`s provided middleware, or pulls from `.neutrinorc.js` if not specified
- Triggers all `pre*` event handlers for the given command name
- Triggers all `prerun` event handlers
- Invokes the given registered command name
- Triggers all event handlers for the given command name
- Triggers all `run` event handlers

The `run` method will invoke the registered command with two arguments: a Webpack configuration object, and the
instance of the Neutrino API. Calling a runnable command will return a
[`Future`](https://github.com/fluture-js/Fluture) which can then be used to kick off the above flow. This Future will
be resolved with the resolution value of the command, or rejected with any errors the command provides. The return
value from the registered command can be any synchronous value, Promise, or Future, and Neutrino will properly chain
from this.

_Example: execute the `jsonify` command we registered in the `register()` example`:

```js
const api = Neutrino();
const Future = require('fluture');

api.register('jsonify', config => Future.of(JSON.stringify(config, null, 2)));

// ...

api
  .run('jsonify')
  .fork(console.error, json => console.log(json));
```

The `run` method takes two arguments:

- A String command name which the API can execute, which has been previously registered
- An optional Array which will be iterated and used as middleware. Not providing this will cause Neutrino to attempt
to load middleware from the local `.neutrinorc.js` file.

Prior to starting this process, Neutrino will trigger and wait for `pre{command}` and `prerun` events to
finish. After it is complete, Neutrino will trigger and wait for `{command}` and `run` events to finish.

```js
const { Neutrino, build } = require('neutrino');
const api = Neutrino();

api.register('build', build);

run('build', ['neutrino-preset-react'])
  .fork(
    errors => errors.forEach(console.error),
    stats => console.log(stats.toString({ colors: true }))
  );
```

## Runnable Functions

The following functions are exported from Neutrino and can be registered with the API to be executed from `run`
(recommended) or `call`. These functions are used internally by the CLI, which creates its own instance of the API and
registers them prior to `run`. Since each of them can be registered directly with the API, they each have the same
signature accepting a Webpack configuration and an API instance.

### `start(webpackConfig, neutrinoApi)`

The `start` function is responsible for creating a development bundle, and when possible, starting a development
server or source watcher. If the Neutrino config contains options for `devServer`, then a webpack-dev-server will be
started, otherwise a Webpack source watcher will be started.

The `start` function returns a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a Webpack compiler (for example, if you wish to listen for
additional build events), or reject with an **array of errors**. This resolution will be completed when the dev server
or Webpack watcher has been started.

Using the `run` method:

```js
const { Neutrino, start } = require('neutrino');
const api = Neutrino();

api.register('start', start);

api.run('start', ['neutrino-preset-react'])
  .fork(
    errors => errors.forEach(err => console.error(err)),
    compiler => console.log('App running!')
  );
```

Calling `start` manually:

```js
const { Neutrino, start } = require('neutrino');
const api = Neutrino();

api.use('neutrino-preset-react');

start(api.config.toConfig(), api)
  .fork(
    errors => errors.forEach(err => console.error(err)),
    compiler => console.log('App running!')
  );
```

### `build(webpackConfig, neutrinoApi)`

The `build` function is responsible for creating a bundle typically used for production.

The `build` function returns a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a Webpack stats object about the build, or reject with an
**array of errors**. This resolution will be completed when the build has been completed.

Using the `run` method:

```js
const { Neutrino, build } = require('neutrino');
const api = Neutrino();

api.register('build', build);

api.run('build', ['neutrino-preset-node'])
  .fork(
    errors => errors.forEach(err => console.error(err)),
    stats => console.log(stats.toString({ colors: true }))
  );
```

Calling `build` manually:

```js
const { Neutrino, build } = require('neutrino');
const api = Neutrino();

api.use('neutrino-preset-node');

build(api.config.toConfig(), api)
  .fork(
    errors => errors.forEach(err => console.error(err)),
    stats => console.log(stats.toString({ colors: true }))
  );
```

### `test(webpackConfig, neutrinoApi)`

The `test` function is typically used for gathering middleware and options needed for testing and triggering relevant
events as a signal to test middleware that they may run. Using the `test` method has no other functionality other than
performing the automated runnable flow outlined above. Since `test()` does nothing other than triggering this flow,
without middleware listening for `test` events, nothing will happen. For this reason, it is recommended that `test` be
used with the `run` method to ensure that all test-related events are properly retriggered. After Neutrino triggers and
waits for `test` events to finish, the test runners will do their work and `test()` can resolve.

Any `args` passed to the API as options are passed on to the event handlers and typically have properties for an array
of `files` to test, as well as a property for `watch`ing and rerunning tests.

The `test` function returns a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved, or reject with an error. This resolution will be completed
when the testing has been finished.

Using the `run` method:

```js
const { Neutrino, test } = require('neutrino');
const api = Neutrino();

api.register('test', test);

api.run('test', ['neutrino-preset-node', 'neutrino-preset-mocha'])
  .fork(
    err => console.error(err),
    () => console.log('Testing completed!')
  );

// With API args
const api = Neutrino({
  args: {
    files: [/* ... */],
    watch: true
  }
});

api.register('test', test);

api.run('test', ['neutrino-preset-node', 'neutrino-preset-mocha'])
  .fork(
    errors => errors.forEach(err => console.error(err)),
    () => console.log('Testing completed!')
  );
```

Calling `test` manually:

```js
const { Neutrino, test } = require('neutrino');
const api = Neutrino();

api.use('neutrino-preset-node');
api.use('neutrino-preset-mocha');

test(api.config.toConfig(), api)
  .fork(
    err => console.error(err),
    () => console.log('Testing completed!')
  );
```

### `inspect(webpackConfig, neutrinoApi)`

The `inspect()` function is responsible for creating an object string which represents a Webpack configuration for the
provided middleware and options. Upon execution `inspect` will:

- Receive the Webpack configuration object
- Deep-sort the object
- Stringify the object with 2 spaces (**not** JSON stringified!)

The `inspect` function returns a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a string representation of the Webpack config, or reject
with an error.

Using the `run` method:

```js
const { Neutrino, inspect } = require('neutrino');
const api = Neutrino();

api.register('inspect', inspect);

api.run('inspect', ['neutrino-preset-node'])
  .fork(
    errors => errors.forEach(err => console.error(err)),
    config => console.log(config)
  );
```

Calling `inspect` manually:

```js
const { Neutrino, inspect } = require('neutrino');
const api = Neutrino();

api.use('neutrino-preset-node');

inspect(api.config.toConfig(), api)
  .fork(
    err => err => console.error(err),
    config => console.log(config)
  );
```
