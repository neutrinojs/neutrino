# Neutrino API

When using Neutrino via the [CLI](/cli/README.md), it creates an instance of the Neutrino API which picks up
any presets and arguments passed on the command line. If you desire, you can also create your own
instance of the Neutrino API and interact with it programmatically.

## Instantiation

In order to access the Neutrino API, you must require or import it and instantiate it, passing in any
preset names or paths you wish to load:

Using `require`:

```js
const Neutrino = require('neutrino');
const api = new Neutrino(['neutrino-preset-react']);
```

Using ES imports:

```js
import Neutrino from 'neutrino';

const api = new Neutrino(['neutrino-preset-react']);
```

## Environment

When using the CLI, environment variables are automatically set based on the command you are using.
When using the API this is not the case, and you **must** set it prior to calling any build commands or
loading any presets.

```js
process.env.NODE_ENV = 'production';

const api = new Neutrino();
api.build();
```

## API

### Constructor

When creating a Neutrino instance, you have the option of providing an array of presets for the API to attempt
to load and merge configurations for. Each preset will attempt to be loaded from the current working directory's
`node_modules`, nested within, by name, or relative file path. If it cannot be found, an exception will be thrown.

In addition to any provided presets, Neutrino will also attempt to load configuration data from the package.json
residing in the current working directory. If this package.json contains an object at `config.neutrino`, this data
will be merged.

### `.config`

When constructing a Neutrino instance, a property of `.config` is set to be a new instance of
[webpack-chain](https://github.com/mozilla-rpweb/webpack-chain). This property is then available to all presets, which
subsequently augment it with their specific options. Every preset added uses this single `.config` to store their data,
meaning that preset load order has an effect on which config values take precedence. Presets loaded later will override
values set by earlier presets.

### `start(args)`

The `start()` method is responsible for creating a development bundle, and when possible, starting a development
server or source watcher. Prior to starting this process, Neutrino will trigger and wait for `prestart` events to
finish. After it is complete, Neutrino will trigger and wait for `start` events to finish.

If the Neutrino config contains options for `devServer`, then a webpack-dev-server will be started. If it is
configured for Node.js, then a build will be created, otherwise a Webpack source watcher will be started.

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
test presets that they may run. Using the `test` method does nothing other than triggering these events; without a
preset listening for these events, nothing will happen. Prior to starting this process, Neutrino will trigger and wait
for `pretest` events to finish. After it is complete, Neutrino will trigger and wait for
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
an options object readable directly by Webpack. This call is cached, so subsequent calls to `getWebpackOptions` will
result in the config being rendered only once, but the cached value returned afterwards.

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

### `_devServer`

This method is used internally to generate an instance of webpack-dev-server during `start()`. It returns a promise that
resolves when the process receives a `SIGINT` event to stop.

```js
api
  ._devServer()
  .then(() => console.log('Exiting process...'));
```
