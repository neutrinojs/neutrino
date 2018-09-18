# Neutrino API

When using Neutrino via the recommended `webpack.config.js` output generator (see build presets docs),
it creates an instance of the Neutrino API which uses the configuration defined in your `.neutrinorc.js`.
If you desire, you can also create your own instance of the Neutrino API and interact with it programmatically.

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
console.log(api.options.mains.index); // { entry: '/project/src/app.js' }
api.options.source = 'lib';
console.log(api.options.mains.index); // { entry: /project/lib/app.js }
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

Multiple entry points and any page-specific configuration (if supported by the preset) can be specified like so:

```js
Neutrino({
  mains: {
    // Relative path, so resolves to options.source + home.*
    index: 'home',

    // Absolute path, used as-is.
    login: '/code/website/src/login.js',

    // Long form that allows passing page-specific configuration
    // (such as html-webpack-plugin options in the case of @neutrinojs/web).
    admin: {
      entry: 'admin',
      // any page-specific options here (see preset docs)
      // ...
    }
  }
})
```

## Other options

### `options.debug`

Informs interested middleware that they should be in a state of debugging. This does not currently make Neutrino itself
behave any differently, rather it can be used to inform middleware to behave differently, by outputting console
information, inspecting processes, or changing configuration which is helpful for debugging.

### `options.extensions`

Informs interested middleware the preferred list of module extensions to support.
By default, `options.extensions` is set to `['wasm', 'mjs', 'vue', 'jsx', 'tsx', 'ts', 'js']`.

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
[webpack-chain](https://github.com/neutrinojs/webpack-chain). This property is then available to all middleware
which subsequently augment it with their specific configuration. All middleware and presets added use this single
`config` to store their data, meaning that middleware load order has an effect on which config values take precedence.
Middleware loaded first will have any configuration overridden by later middleware with matching properties.

### `use(middlewareFormat)`

Use a Neutrino middleware format, optionally providing options which will be passed to the middleware.
Middleware functions will be invoked with two arguments:

1. The Neutrino API instance
2. Any middleware options argument passed to `use`.

#### Manually loading middleware with `use`

Using the Neutrino API you can load [middleware](./middleware.md) and presets (which are also just middleware)
using the `use` method. The `use` method takes in a middleware format and optionally any options that should be
passed to the middleware. See [middleware formats](./middleware.md#formats) for details on the different ways to
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

_Example: add a new runnable command which resolves with a JSON-formatted webpack configuration:_

```js
api.register(
  'jsonify',
  config => JSON.stringify(config, null, 2),
  'Output a JSON representation of the accumulated webpack configuration'
);
```

The registered command can be triggered from `call()`, `run()`, or via the CLI.

## Runnable Functions

The following functions are exported from Neutrino and can be registered with the API to be executed from `run`
(recommended) or `call`. These functions are used internally by the CLI, which creates its own instance of the API and
registers them prior to `run`. Since each of them can be registered directly with the API, they each have the same
signature, accepting a webpack configuration and an API instance.

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

// defaults neutrino.options.extensions which resolves to /\.(wasm|mjs|vue|jsx|tsx|ts|js)$/
neutrino.regexFromExtensions();
```
