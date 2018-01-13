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

const api = Neutrino(options);
```

Using ES imports:

```js
import { Neutrino } from 'neutrino';

const api = Neutrino(options);
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
api.options.mains.index = 'app.js';
console.log(api.options.mains.index); //   /project/src/app.js
api.options.source = 'lib';
console.log(api.options.mains.index); //   /project/lib/app.js
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

### `options.mains`

Set the main entry points for the application. If the option is not set, Neutrino defaults it to:
 
```js
{
  index: 'index'
}
```
 
Notice the entry point has no extension; the extension is resolved by webpack. If relative paths are specified,
they will be computed and resolved relative to `options.source`; absolute paths will be used as-is.

```js
Neutrino({
  mains: {
    // If not specified, defaults to options.source + index.*
    index: 'index',
    
    // Override to relative, resolves to options.source + entry.*
    index: 'entry',
  
    // Override to absolute path
    index: '/code/website/src/entry.js'
  }
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

### `options.command`

The currently running CLI command, e.g. `build`, `start`, `lint`, etc. This value is typically
set by the CLI when instantiating the API, but can also be set manually. This value is used by some
middleware to determine when to augment the configuration with certain functionality.

### `options.extensions`

Informs interested middleware the preferred list of module extensions to support.
By default, `options.extensions` is set to `['js', 'jsx', 'vue', 'ts', 'tsx', 'mjs']`.

### `options.packageJson`

Returns the `package.json` object defined at the root level of the project.

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

## Events

### `on(eventName, handler)`

Add a `handler` function to a Neutrino instance that listens to events named `eventName`. If the event handler
is going to be used with `emitForAll`, ensure the `handler` returns a Promise. Use the `*` event name to
execute the handler for all events. Note that `*` events are triggered after named events.

```js
api.on('custom-event', () => {
  // ...
});
```

### `off(eventName, handler)`

Remove a `handler` function from listening to a particular `eventName`, including `*` events.

```js
const handler = () => /* ... */;

api.on('custom-event', handler);

api.off('custom-event', handler);
```

### `emit(eventName, payload)`

Invoke all handlers for the given `eventName`. Note that `*` handlers are executed after named events. You may
also pass an optional `payload` value to be passed as an argument to the associated event handler function.

```js
api.emit('custom-event', { /* payload */ });
```

### `emitForAll(eventName, payload)`

Invoke all handlers for the given `eventName`, meant for usage with Promise-dependent events. For example, calling
`emitForAll('build')` will trigger an event named build, and each event handler can return a Promise denoting when it
is finished. When all events have finished, this call will resolve.

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

api.on('custom-event', (args, payload) => {
  console.log(payload.custom); // "payload"
});
```

### `config.toConfig()`

While tools like webpack-chain provide a convenient API for creating webpack configurations, this is not a format that
is understandable by webpack. With `config.toConfig()`, the webpack-chain instance at `config` will be converted to
a configuration object readable directly by webpack.

```js
api.config.toConfig(); // -> { ... }
```

### `register(command, handler, description = '')`

This method registers a new command which can be run from the API at a later time. This function takes three
arguments: a String command name, a Function which accepts a webpack configuration and the API, and an optional string
description. The return value of `handler` depends on the expected usage of the command. The description is optional,
but useful when using `--help` from the command line to view available commands.

The handler function can accept two arguments:

1. A webpack configuration object. This is the result of calling `api.config.toConfig()`, and represents a
webpack-usable object
2. The Neutrino API instance

_Example: add a new runnable command which resolves with a JSON-formatted webpack configuration:`

```js
api.register(
  'jsonify',
  config => JSON.stringify(config, null, 2),
  'Output a JSON representation of the accumulated webpack configuration'
);
```

The registered command can be triggered from `call()`, `run()`, or via the CLI.

### `require(moduleId)`

This method is typically used internally by the Neutrino API to attempt to require a string module ID in various paths
before failing. Takes a String `moduleId` and returns the first exports of the module it is able to require. This
will throw an exception if Neutrino is unable to require the specified module ID in any of its know paths.

### `call(commandName)`

This API method will invoke a command function that has been previously defined by the `register` method.
The `commandName` argument should be a String. Any necessary middleware should be used prior to invoking `call`.

The `call` method will invoke the registered command with two arguments: a webpack configuration object, and the
instance of the Neutrino API. The return value of using `call` will be the return value of invoking the registered
handler with these two arguments.

For a concrete example, the [eslint middleware](../packages/eslint) registers an `eslintrc`
command. The results of this command can be returned with `call`, which is loaded within
`.neutrinorc.js` in this example:

```js
const { Neutrino } = require('neutrino');

const eslintConfig = Neutrino()
  .use('.neutrinorc.js')
  .call('eslintrc');
```

### `run(commandName)`

This API method will invoke a command function that has been previously defined by the `register` method.
The `commandName` argument should be a String. Any necessary middleware should be used prior to invoking `run`.

Every runnable command performs the following flow:

- Triggers all `pre*` event handlers for the given command name
- Triggers all `prerun` event handlers
- Invokes the given registered command function
- Triggers all event handlers for the given command name
- Triggers all `run` event handlers

The `run` method will invoke the registered command with two arguments: a webpack configuration object, and the
instance of the Neutrino API. Calling a runnable command will return a
[`Future`](https://github.com/fluture-js/Fluture) which can then be used to kick off the above flow. This Future will
be resolved with the resolution value of the command, or rejected with any errors the command provides. The return
value from the registered command can be any synchronous value, Promise, or Future, and Neutrino will properly chain
from this.

The Neutrino package exports functions to automate key parts of interacting with the Neutrino API, and they are named
`build`, `inspect`, `start`, and `test`. These are command functions that are invoked when using the CLI.
As an example, the CLI does this similar to the following:

```js
const { Neutrino, build } = require('neutrino');

const api = Neutrino();

api.register('build', build);

// later
api
  .use(middleware)
  .run('build')
  .fork(
    (errs) => { /* handle errors */ },
    () => { /* handle success */ }
  );

```

_Example: execute the `jsonify` command we registered in the `register()` example, and resolve with a Future`:

```js
const api = Neutrino();
const Future = require('fluture');

api.register('jsonify', config => Future.of(JSON.stringify(config, null, 2)));

// ...

api
  .run('jsonify')
  .fork(console.error, json => console.log(json));
```

_Example: execute the `jsonify` command we registered in the `register()` example, and resolve with a Promise`:

```js
const api = Neutrino();

api.register('jsonify', config => Promise.resolve(JSON.stringify(config, null, 2)));

// ...

api
  .run('jsonify')
  .fork(console.error, json => console.log(json));
```

The `run` method takes a single argument, a String command name which the API can execute,
which has been previously registered with `register`.

Prior to starting this process, Neutrino will trigger and wait for `pre{command}` and `prerun` events to
finish. After it is complete, Neutrino will trigger and wait for `{command}` and `run` events to finish.

```js
const { Neutrino, build } = require('neutrino');
const api = Neutrino();

api
  .register('build', build)
  .use('@neutrinojs/react')
  .run('build')
  .fork(
    errors => errors.forEach(console.error),
    stats => console.log(stats.toString({ colors: true }))
  );
```

## Runnable Functions

The following functions are exported from Neutrino and can be registered with the API to be executed from `run`
(recommended) or `call`. These functions are used internally by the CLI, which creates its own instance of the API and
registers them prior to `run`. Since each of them can be registered directly with the API, they each have the same
signature, accepting a webpack configuration and an API instance.

### `start(webpackConfig, neutrinoApi)`

The `start` function is responsible for creating a development bundle, and when possible, starting a development
server or source watcher. If the Neutrino config contains options for `devServer`, then a webpack-dev-server will be
started, otherwise a webpack source watcher will be started.

The `start` function returns a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a webpack compiler (for example, if you wish to listen for
additional build events), or reject with an **array of errors**. This resolution will be completed when the dev server
or webpack watcher has been started.

_Example: using the `run` method:_

```js
const { Neutrino, start } = require('neutrino');
const api = Neutrino();

api
  .register('start', start)
  .use('@neutrinojs/react')
  .run('start')
  .fork(
    errors => errors.forEach(err => console.error(err)),
    compiler => console.log('App running!')
  );
```

_Example: calling `start` manually:_

```js
const { Neutrino, start } = require('neutrino');
const api = Neutrino();

api.use('@neutrinojs/react');

start(api.config.toConfig(), api)
  .fork(
    errors => errors.forEach(err => console.error(err)),
    compiler => console.log('App running!')
  );
```

### `build(webpackConfig, neutrinoApi)`

The `build` function is responsible for creating a bundle typically used for production.

The `build` function returns a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a webpack stats object about the build, or reject with an
**array of errors**. This resolution will be completed when the build has been completed.

_Example: using the `run` method:_

```js
const { Neutrino, build } = require('neutrino');
const api = Neutrino();

api
  .register('build', build)
  .use('@neutrinojs/node')
  .run('build')
  .fork(
    errors => errors.forEach(err => console.error(err)),
    stats => console.log(stats.toString({ colors: true }))
  );
```

_Example: calling `build` manually_:

```js
const { Neutrino, build } = require('neutrino');
const api = Neutrino();

api.use('@neutrinojs/node');

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

_Example: Using the `run` method:_

```js
const { Neutrino, test } = require('neutrino');
const api = Neutrino();

api
  .register('test', test)
  .use('@neutrinojs/node')
  .use('@neutrinojs/mocha')
  .run('test')
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

api
  .register('test', test)
  .use('@neutrinojs/node')
  .use('@neutrinojs/mocha')
  .run('test')
  .fork(
    errors => errors.forEach(err => console.error(err)),
    () => console.log('Testing completed!')
  );
```

_Example: calling `test` manually:_

```js
const { Neutrino, test } = require('neutrino');
const api = Neutrino();

api
  .use('@neutrinojs/node')
  .use('@neutrinojs/mocha');

test(api.config.toConfig(), api)
  .fork(
    err => console.error(err),
    () => console.log('Testing completed!')
  );
```

### `inspect(webpackConfig, neutrinoApi)`

The `inspect()` function is responsible for creating an object string which represents a webpack configuration for the
provided middleware and options. Upon execution `inspect` will:

- Receive the webpack configuration object
- Deep-sort the object
- Stringify the object with 2 spaces (**not** JSON stringified!)

The `inspect` function returns a [`Future`](https://github.com/fluture-js/Fluture) which can then be used to
kick off the runnable flow. This Future will be resolved with a string representation of the webpack config, or reject
with an error.

_Example: using the `run` method:_

```js
const { Neutrino, inspect } = require('neutrino');
const api = Neutrino();

api
  .register('inspect', inspect)
  .use('@neutrinojs/node')
  .run('inspect')
  .fork(
    errors => errors.forEach(err => console.error(err)),
    config => console.log(config)
  );
```

_Example: calling `inspect` manually:_

```js
const { Neutrino, inspect } = require('neutrino');
const api = Neutrino();

api.use('@neutrinojs/node');

inspect(api.config.toConfig(), api)
  .fork(
    err => err => console.error(err),
    config => console.log(config)
  );
```

## Helper Methods

### `regexFromExtensions`

Using the Neutrino API you can get a regex expression from a list of extensions using the `regexFromExtensions` method.
The `regexFromExtensions` takes in an array of extensions as a parameter but can be invoked
without any parameters which fallback to `neutrino.options.extensions`.

```js
// resolves to /\.(vue|js)$/
neutrino.regexFromExtensions(['vue', 'js']);

// defaults neutrino.options.extensions which resolves to /\.(js|jsx|vue|ts|tsx|mjs)$/
neutrino.regexFromExtensions();
```
