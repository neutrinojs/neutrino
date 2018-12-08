# Neutrino API

When using the Neutrino package via the recommended `webpack.config.js` output generator
(see build presets docs), it creates an instance of the Neutrino API which uses the
configuration defined in your `.neutrinorc.js`. If you desire, you can also create your
own instance of the Neutrino API and interact with it programmatically.

## Importing

The default export of the `neutrino` package is a function which instantiates the `Neutrino`
API class, sets some defaults around `NODE_ENV` and webpack's `mode`, as well setting up
some basic output handlers. To access the `Neutrino` API class, you can require it via:

```js
const Neutrino = require('neutrino/Neutrino');
```

The `Neutrino` API class is the core middleware control mechanism and is responsible
for all the work which composes and accumulates middleware and presets for consumption
by webpack, ESLint, test runners, etc. Let's cover getting started with the `Neutrino`
API class and then its available methods.

## Instantiation

In order to access the `Neutrino` API class, you must require or import it and invoke it,
passing in any options:

Using `require`:

```js
const Neutrino = require('neutrino/Neutrino');

const api = new Neutrino(options);
```

Using ES imports:

```js
import Neutrino from 'neutrino/Neutrino';

const api = new Neutrino(options);
```

## API options

The Neutrino API class can accept an object for setting a number of useful options.

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
new Neutrino({
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
new Neutrino({
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
new Neutrino({
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
new Neutrino({
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
new Neutrino({
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
By default, `options.extensions` is set to `['mjs', 'jsx', 'js']`.

### `options.packageJson`

Returns the `package.json` object defined at the root level of the project.

## Neutrino API

When creating a Neutrino instance, you have the option of providing an object which can be passed as options to
middleware as `neutrino.options`.

```js
const Neutrino = require('neutrino/Neutrino');

const neutrino = new Neutrino();

// or with optional options
const neutrino = new Neutrino({ output: 'dist' });
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

### `use(middlewareFunction)`

Use a Neutrino middleware function which can extend or modify Neutrino configuration,
options, and registered handlers. Middleware functions will be invoked with a single
argument, the Neutrino API instance. Using the Neutrino API you can load
[middleware](./middleware.md) and presets (which are also just middleware)
using the `use` method.

```js
neutrino.use(neutrino => {
  /* ... */
})
```

For the built-in middleware, these are often exposed as functions **which return
Neutrino middleware**. This allows middleware to also accept options for controlling
how they operate:

```js
const react = require('@neutrinojs/react');

// calling react() returns a new middleware function:
neutrino.use(react({ /* ... */ }));
```

### `config.toConfig()`

While tools like webpack-chain provide a convenient API for creating webpack configurations, this is not a format that
is understandable by webpack. With `config.toConfig()`, the webpack-chain instance at `config` will be converted to
a configuration object readable directly by webpack.

```js
api.config.toConfig(); // -> { ... }
```

### `register(name, handler)`

This method registers a new output handler which is typically consumed by CLI configuration files for
outputting a special format based on the accumulated middleware. This method takes two
arguments: a String output handler name and a Function which accepts the Neutrino API instance.
The return value of `handler` depends on the expected usage of the function call and varies accordingly.

_Example: register a new output handler which returns a well-known postcss configuration:_

```js
api.register('postcss', neutrino => {
  return neutrino.config.module
    .rule('style')
    .use('postcss')
    .get('options')
});
```

This registered output handler can now be called directly from a `postcss.config.js` file as
long as middleware was loaded for the Neutrino API which registered this handler:

```js
// postcss.config.js
const neutrino = require('neutrino');

module.exports = neutrino().postcss();
```

### `regexFromExtensions`

Using the Neutrino API you can get a regular expression from a list of extensions using the `regexFromExtensions` method.
The `regexFromExtensions` takes in an array of extensions as a parameter but can be invoked
without any parameters which fallback to `neutrino.options.extensions`.

```js
// resolves to /\.(vue|js)$/
neutrino.regexFromExtensions(['vue', 'js']);

// defaults neutrino.options.extensions which resolves to /\.(mjs|jsx|js)$/
neutrino.regexFromExtensions();
```
