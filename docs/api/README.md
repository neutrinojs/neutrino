# Neutrino API

When using Neutrino via the [CLI](../cli/README.md), it creates an instance of the Neutrino API which picks up
any middleware and arguments passed on the command line or located in package.json. If you desire, you can also create
your own instance of the Neutrino API and interact with it programmatically.

## Importing

The default export of the Neutrino module is an object with several mechanisms for interacting with the API:

```js
const {
  Neutrino,
  run,
  build,
  inspect,
  start,
  test
} = require('neutrino');
```

The `Neutrino` function is the lowest-level API, with each of the other methods a higher-level API
which creates an instance of the API internally. First, we will cover the low-level `Neutrino` API and
later showing how to use the higher-level functions.

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

The Neutrino function can accept an object for setting a number of useful options:

### `options.root`

Set the base directory which Neutrino middleware and presets operate on. Typically this is the project directory where
the package.json would be located. If the option is not set, Neutrino defaults it to `process.cwd()`. If a relative
path is specified, it will be resolved relative to `process.cwd()`; absolute paths will be used as-is.

```js
Neutrino({
  // if not specified, defaults to process.cwd()

  // relative, resolves to process.cwd() + ./website
  root: './website',

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

  // relative, resolves to options.root + ./lib
  source: './lib',

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

  // relative, resolves to options.root + ./dist
  output: './dist',

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

  // relative, resolves to options.root + ./testing
  tests: './testing',

  // absolute
  tests: '/code/website/testing'
})
```

### `options.entry`

Set the main entry point for the application. If the option is not set, Neutrino defaults it to `index.js`.
If a relative path is specified, it will be resolved relative to `options.source`; absolute paths will be used as-is.

```js
Neutrino({
  // if not specified, defaults to options.source + index.js

  // relative, resolves to options.source + ./entry.js
  entry: './entry.js',

  // absolute
  entry: '/code/website/lib/entry.js'
})
```

### `options.node_modules`

Set the directory which contains the Node.js modules of the project. If the option is not set, Neutrino defaults it to
`node_modules`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be
used as-is.

```js
Neutrino({
  // if not specified, defaults to options.root + node_modules

  // relative, resolves to options.root + ./modules
  node_modules: './modules',

  // absolute
  node_modules: '/code/website/modules'
})
```

## Loading middleware

Using the Neutrino API you can load [middleware](../middleware/README.md) and presets (which are also just middleware)
using the `use` method. The `use` method takes in a middleware function, and optionally any options that should be
passed to the middleware function.

```js
neutrino.use(middleware, middlewareOptions)
```

Typically presets do not require any additional options, and middleware may, but check with your particular package
for specifics. As an example, if you wanted to require the list of presets and Neutrino options from a package.json:

```js
const { Neutrino } = require('neutrino');
const pkg = require('./package.json');

const neutrino = Neutrino(pkg.neutrino.options);

neutrino.use(require(pkg.neutrino.use[0]));
```

You can call `.use` iteratively for multiple presets:

```js
pkg.neutrino.use
  .map(require)
  .map(neutrino.use);
```

## Environment

When using the CLI and the higher-level API functions, environment variables are automatically set based on the command
you are using. When using the `Neutrino` low-level API this is not the case, and you **must** set it prior to calling
any build commands or loading any middleware if you expect them to build correctly based on their target.

```js
const neutrino = Neutrino();

process.env.NODE_ENV = 'production';
// load middleware...
```

## Neutrino API

When creating a Neutrino instance, you have the option of providing an object which can be passed as options to
middleware as `neutrino.options`.

```js
const { Neutrino } = require('neutrino');

const neutrino = Neutrino();

// or with optional options
const neutrino = Neutrino({ jest: { bail: true } });
```

### `options`

An object containing various properties for the benefit of the API and middleware. This can contain
options set by both Neutrino and any included middleware.

### `config`

When constructing a Neutrino instance, a property of `config` is set to be a new instance of
[webpack-chain](https://github.com/mozilla-neutrino/webpack-chain). This property is then available to all presets
which subsequently augment it with their specific configuration. All middleware and presets added use this single
`config` to store their data, meaning that middleware load order has an effect on which config values take precedence.
Middleware loaded first will have any configuration overridden by later middleware with matching properties.

### `use(middleware, middlewareOptions)`

Invoke a Neutrino middleware function, optionally providing options which will be passed to the middleware function.
Middleware will be invoked with two arguments:

1. The Neutrino instance
2. The optional `middlewareOptions`

For example, given the following middleware function:

```js
function middleware(neutrino, options) {
  neutrino.config
    .entry('index')
    .prepend(options.entryPoint);
}

// Passing this middleware function to Neutrino, along with some options:
neutrino.use(middleware, { entryPoint: 'babel-polyfill' });
```

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

### `requiresAndUses(middleware)`

This method takes an array of module strings which map to the location of middleware and returns a
[`Future`](https://github.com/fluture-js/Fluture) which will attempt to look up, require, and `use` each middleware.
This function is shorthand for `api.useRequires(api.requires(middleware))`.

The Future can be resolved with an [Immutable List](https://facebook.github.io/immutable-js/docs/#/List) of middleware,
or rejected with an error if a failure occurs requiring the middleware.

```js
api.requiresAndUses(['middleware-alpha', 'middleware-beta'])
  .fork(
    err => console.log('Could not import middleware', err),
    () => console.log('Finished importing all middleware')
  );
```

### `requires(middleware)`

This method takes an array of module strings which map to the location of middleware and returns a
[`Future`](https://github.com/fluture-js/Fluture) which will attempt to look up and require each middleware.
The middleware is not `use`d at this point, only required.

The Future can be resolved with an [Immutable List](https://facebook.github.io/immutable-js/docs/#/List) of middleware,
or rejected with an error if a failure occurs requiring the middleware.

```js
// Using Future to fork and handle any errors
api
  .requires(['middleware-alpha', 'middleware-beta'])
  .fork(
    err => console.log('Could not require middleware', err),
    middleware => middleware.map(console.log)
  );
```

```js
// Using Future promise API to fork and handle any errors
api
  .requires(['middleware-alpha', 'middleware-beta'])
  .promise()
    .then(middleware => middleware.map(console.log))
    .catch(err => console.log('Could not require middleware', err));
```

### `useRequires(requires)`

Accepts a [`Future`](https://github.com/fluture-js/Fluture) of a
[List](https://facebook.github.io/immutable-js/docs/#/List) of middleware to run through `api.use`. Useful for passing
the Future from `api.requires` to have the List to be subsequently `use`d.

The Future can be resolved with an [Immutable List](https://facebook.github.io/immutable-js/docs/#/List) of middleware,
or rejected with an error if a failure occurs requiring the middleware.

```js
// Using Future to fork and handle any errors
api.useRequires(api.requires(['middleware-alpha', 'middleware-beta']))
  .fork(
    err => console.log('Could not import middleware', err),
    () => console.log('Finished importing all middleware')
  );
```

### `register(command, handler)`

This method registers a new command which can be run from the API at a later time. This function takes two
arguments: a string command name, and a function which accepts a Webpack configuration and returns a
[`Future`](https://github.com/fluture-js/Fluture).

_Example: add a new runnable command which resolves with a JSON-formatted Webpack configuration:`

```js
const api = Neutrino();
const Future = require('fluture');

api.register('jsonify', config => Future.of(JSON.stringify(config, null, 2)));
```

### `run(command)`

This method returns a Future which executes a command which has been registered in the Neutrino API. It accepts a
single argument for the command name to run.

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

## `run` API

The Neutrino package contains several functions automate several pieces of interacting with the Neutrino API.
There is the mid-level `run` function, and higher-level functions `build`, `inspect`, `start`, and `test`. These are
functions that are invoked when using the CLI.

Every runnable command performs the following flow:

- Instantiates a `Neutrino` API
- Sets the `NODE_ENV` environment variable
- Requires and `use`s provided middleware
- Merges any config overrides at `options.config` into the `api.config` at a higher precedence
- Triggers all `pre` events for the given command name
- Invokes `api.run` for the registered command name
- Triggers all events for the given command name

Calling a runnable command will return a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the above flow. This Future will be resolved with the resolution value of the command, or rejected
with any errors the command provides.

### `run(command, middleware, options)`

The lower-level `run` function takes three arguments:

- A string command name which the API can call
- An array of module strings which will be required and used as middleware
- An object of options that should be specified to the Neutrino API

Prior to starting this process, Neutrino will trigger and wait for `pre{command}` events to
finish. After it is complete, Neutrino will trigger and wait for `{command}` events to finish.

```js
const { run } = require('neutrino');

run('build', ['neutrino-preset-react'])
  .fork(
    errors => errors.forEach(console.error),
    stats => console.log(stats.toString({ colors: true }))
  );
```

### `start(middleware, options)`

The `start` function takes two arguments:

- An array of module strings which will be required and used as middleware
- An object of options that should be specified to the Neutrino API

The `start()` function is responsible for creating a development bundle, and when possible, starting a development
server or source watcher. Prior to starting this process, Neutrino will trigger and wait for `prestart` events to
finish. After it is complete, Neutrino will trigger and wait for `start` events to finish.

If the Neutrino config contains options for `devServer`, then a webpack-dev-server will be started, otherwise a Webpack
source watcher will be started.

Calling start will return a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a Webpack compiler (for example, if you wish to listen for
additional build events), or reject with an **array of errors**. This resolution will be completed when the dev server
or Webpack watcher has been started.

```js
const { start } = require('neutrino');

start(['neutrino-preset-react'])
  .fork(
    errors => errors.forEach(console.error),
    compiler => console.log('App running!')
  );
```

### `build(middleware, options)`

The `build` function takes two arguments:

- An array of module strings which will be required and used as middleware
- An object of options that should be specified to the Neutrino API

The `build()` function is responsible for creating a bundle typically used for production. Prior to starting this process,
Neutrino will trigger and wait for `prebuild` events to finish. After it is complete, Neutrino will trigger and wait for
`build` events to finish.

Calling start will return a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a Webpack stats object about the build, or reject with an
**array of errors**. This resolution will be completed when the build has been completed.

```js
const { build } = require('neutrino');

build(['neutrino-preset-node'])
  .fork(
    errors => errors.forEach(console.error),
    stats => console.log(stats.toString({ colors: true }))
  );
```

### `test(middleware, options)`

The `test` function takes two arguments:

- An array of module strings which will be required and used as middleware
- An object of options that should be specified to the Neutrino API

The `test()` function is responsible for gathering middleware and options needed for testing and triggering relevant
events as a signal to test middleware that they may run. Using the `test` method has no other functionality other than
performing the automated runnable flow outlined above. Since `test()` does nothing other than triggering this flow,
without middleware listening for `test` events, nothing will happen. Prior to starting this process, Neutrino will
trigger and wait for `pretest` events to finish. After it is complete, Neutrino will trigger and wait for
`test` events to finish, in which test runners will do their work.

Any `args` passed to `test()` are passed on to the event handles and typically have properties for an array of
`files` to test, as well as a property for `watch`ing and rerunning tests.

Calling start will return a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved, or reject with **an error**. This resolution will be completed
when the testing has been finished.

```js
const { test } = require('neutrino');

test(['neutrino-preset-node'])
  .fork(
    err => console.error(err),
    () => console.log('Testing completed!')
  );

// ---

test(['neutrino-preset-node'], { args: { files: [/* ... */], watch: true } })
  .fork(
    err => console.error(err),
    () => console.log('Testing completed!')
  );
```

### `inspect(middleware, options)`

The `inspect` function takes two arguments:

- An array of module strings which will be required and used as middleware
- An object of options that should be specified to the Neutrino API

The `inspect()` function is responsible for creating an object string which represents a Webpack configuration for the
provided middleware and options. Upon following the runnable flow, `inspect()` will:

- Grab the Webpack configuration object
- Deep-sort the object
- Stringify the object with 2 spaces (**not** JSON stringified!)

Calling start will return a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a string representation of the Webpack config, or reject
with **an error**. This resolution will be completed when the build has been completed.

```js
const { inspect } = require('neutrino');

inspect(['neutrino-preset-node'])
  .fork(
    err => console.error(err),
    config => console.log(config)
  );
```
