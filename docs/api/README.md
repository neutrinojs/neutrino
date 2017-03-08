# Neutrino API

When using Neutrino via the [CLI](../cli/README.md), it creates an instance of the Neutrino API which picks up
any presets and arguments passed on the command line or located in package.json. If you desire, you can also create your
own instance of the Neutrino API and interact with it programmatically.

## Instantiation

In order to access the Neutrino API, you must require or import it and instantiate it, passing in any
options:

Using `require`:

```js
const Neutrino = require('neutrino');

const api = new Neutrino(options);
```

Using ES imports:

```js
import Neutrino from 'neutrino';

const api = new Neutrino(options);
```

## API options

The Neutrino constructor can accept an object for setting a number of useful options:

### `options.root`

Set the base directory which Neutrino middleware and presets operate on. Typically this is the project directory where
the package.json would be located. If the option is not set, Neutrino defaults it to `process.cwd()`. If a relative
path is specified, it will be resolved relative to `process.cwd()`; absolute paths will be used as-is.

```js
new Neutrino({
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
new Neutrino({
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
new Neutrino({
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
new Neutrino({
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
new Neutrino({
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
new Neutrino({
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
api.use(middleware, middlewareOptions)
```

Typically presets do not require any additional options, and middleware may, but check with your particular package
for specifics. As an example, if you wanted to require the list of presets and Neutrino options from a package.json:

```js
const Neutrino = require('neutrino');
const pkg = require('./package.json');

const api = new Neutrino(pkg.neutrino.options);

api.use(require(pkg.neutrino.presets[0]));
```

You can call `.use` iteratively for multiple presets:

```js
pkg.neutrino.presets
  .forEach(preset => neutrino.use(require(preset)));
```

## Environment

When using the CLI, environment variables are automatically set based on the command you are using.
When using the API this is not the case, and you **must** set it prior to calling any build commands or
loading any presets if you expect them to build correctly based on their target.

```js
process.env.NODE_ENV = 'production';

const api = new Neutrino();

// load presets...

api.build();
```

## API

### Constructor

When creating a Neutrino instance, you have the option of providing an object which can be passed as options to
middleware as `neutrino.options`.

```js
const Neutrino = require('neutrino');

const api = new Neutrino();

// or with optional options
const api = new Neutrino({ jest: { bail: true } });
```

### `.config`

When constructing a Neutrino instance, a property of `.config` is set to be a new instance of
[webpack-chain](https://github.com/mozilla-neutrino/webpack-chain). This property is then available to all presets
which subsequently augment it with their specific configuration. All middleware and presets added use this single
`.config` to store their data, meaning that middleware load order has an effect on which config values take precedence.
Middleware loaded first will have any configuration overridden by later middleware with matching properties.

### `.use(middleware, middlewareOptions)`

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

### `start(args)`

The `start()` method is responsible for creating a development bundle, and when possible, starting a development
server or source watcher. Prior to starting this process, Neutrino will trigger and wait for `prestart` events to
finish. After it is complete, Neutrino will trigger and wait for `start` events to finish.

If the Neutrino config contains options for `devServer`, then a webpack-dev-server will be started, otherwise a Webpack
source watcher will be started.

Currently any `args` passed to `start()` have no effect and will be passed through to any event handlers.

The `start` method will return a Promise which resolves after the build is done or development watcher has stopped,
and all `start` events have finished.

```js
api
  .start()
  .then(() => console.log('Exiting!'));
```

### `build(args)`

The `build()` method is responsible for creating a bundle typically used for production. Prior to starting this process,
Neutrino will trigger and wait for `prebuild` events to finish. After it is complete, Neutrino will trigger and wait for
`build` events to finish.

Currently any `args` passed to `build()` have no effect and will be passed through to any event handlers.

The `build` method will return a Promise which resolves after the build is done and all `build` events have finished, or
will reject if there was a failure during building.

```js
api
  .build()
  .then(() => console.log('Saved to build/'))
  .catch(err => console.error(err));
```

### `test(args)`

The `test()` method is responsible for gathering args needed for testing and triggering relevant events as a signal to
test presets that they may run. Using the `test` method does nothing other than triggering these events; without
middleware listening for these events, nothing will happen. Prior to starting this process, Neutrino will trigger and
wait for `pretest` events to finish. After it is complete, Neutrino will trigger and wait for
`test` events to finish, in which test runners will do their work.

Any `args` passed to `test()` are passed on to the event handles and typically have properties for an array of
`files` to test, as well as a property for `watch`ing and rerunning tests.

The `test` method will return a Promise which resolves after all `test` events have finished, or
will reject if there was a failure during testing.

```js
api
  .test()
  .then(() => console.log('all passed'))
  .catch(err => console.error(err));

api
  .test({
    files: [/* ... */],
    watch: true
  })
  .then(() => console.log('all passed'));
```

### `getWebpackOptions()`

While tools like webpack-chain provide a convenient API for creating Webpack configurations, this is not a format that
is understandable by Webpack. With `getWebpackOptions()`, the webpack-chain instance at `.config` will be converted to
an configuration object readable directly by Webpack.

```js
api.getWebpackOptions(); // -> { ... }
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

### `handleErrors(err, stats)`

This method is used internally to create a consistent console output when errors occur in the build. It will
log the `err` property and any errors from `stats` if applicable, and return `true` or `false` depending on if there
_were_ errors.

This method returns a Boolean.

```js
const failed = api.handleErrors(err, stats);

if (failed) {
  console.log('The build failed!');
}
```

### `devServer()`

This method is used internally to generate an instance of webpack-dev-server when using `start()`. It returns a promise
that resolves when the process receives a `SIGINT` event to stop.

```js
api
  .devServer()
  .then(() => console.log('Exiting process...'));
```

### `builder()`

This method is used internally to generate an instance of a Webpack compiler when using `build()`. It returns a promise
that resolves when the Webpack build has completed, or rejects if the build fails.

```js
api
  .builder()
  .then(() => console.log('Exiting process...'))
  .catch(() => console.error('Build failed!'));
```

### `watcher()`

This method is used internally to generate an instance of a Webpack source watcher when using `start()`. It returns a promise
that resolves when the process receives a `SIGINT` event to stop and the watcher has closed.

```js
api
  .watcher()
  .then(() => console.log('Exiting process, done watching...'));
```
