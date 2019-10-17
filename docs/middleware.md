# Middleware

The basic unit of interacting with Neutrino is middleware. Middleware can modify configuration,
listen for events, get build metadata, or augment Neutrino with custom functionality.

## Middleware function

Using a function as middleware gives direct access to the Neutrino API, configuration,
and options.

```js
function middleware(neutrino) {}
```

If middleware needs its own options, your package can export a factory function/closure for
returning a new middleware function. This closure can optionally accept an `options` argument.
These arguments can be whatever value you choose.

If you're familiar with middleware from the Express/connect world, this works similarly. When using Express middleware,
you provide a function to Express which receives arguments to modify a request or response along its lifecycle. There
can be a number of middleware functions that Express can load, each one potentially modifying a request or response in
succession. Neutrino will execute middleware functions similarly, where each function successively interacts with Neutrino along
the lifecycle.

To use a concrete example, let's create middleware that adds an environment plugin:

```js
const { EnvironmentPlugin } = require('webpack');

module.exports = (neutrino) => {
  neutrino.config
    .plugin('env')
    .use(EnvironmentPlugin, ['NODE_ENV']);
};
```

This middleware can now be used by consumers in their `.neutrinorc.js`:

```js
const envLoader = require('neutrino-middleware-env-loader');

module.exports = {
  use: [
    envLoader
  ]
};
```

If your middleware requires configuration _outside_ of the options necessary for _running_ the middleware,
use a closure technique for simplifying this for your middleware consumers. In short, your module will provide a
function to consumers which, when executed, will return a Neutrino middleware function. Describing this in code:

```js
module.exports = function wrapper(...args) {
  return function middleware(neutrino) {
    // do something with neutrino and and args
  };
};
```

Let's say you decide to accept additional environment variables to load via
your middleware. You can specify these in a closure and return your middleware.
For example:

```js
const { EnvironmentPlugin } = require('webpack');

// Export a function which, when called, returns a middleware function.
module.exports = (additionalEnvs = []) => (neutrino) => {
  neutrino.config
    .plugin('env')
    .use(EnvironmentPlugin, ['NODE_ENV', ...additionalEnvs]);
};
```

This middleware can now be used by consumers in their `.neutrinorc.js`, but now
needs to be called in order for a valid middleware function to be passed to
`use`:

```js
const envLoader = require('neutrino-middleware-env-loader');

module.exports = {
  use: [
    envLoader(),
    
    // Or with custom environment variables now supported:
    envLoader(['CSS_MODULES'])
  ]
};
```

### neutrinorc

The `.neutrinorc.js` file, which project creators use for defining how their projects
are built, often export an object capable of overriding configuration and options.
The object format is the recommended format when creating `.neutrinorc.js` files
as it provides a good balance between easily setting options and using other middleware.
This object format can be structured as follows:

```js
const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');

module.exports = {
  // specify options to override in the Neutrino API
  options: {
    // for example, change the output directory to dist
    output: 'dist',
    // or set the default development port to 3000
    port: 3000
  },

  // The "use" array defines another set of middleware for Neutrino to use.
  use: [
    airbnb(),
    react({ html: { title: 'Epic React App' } }),
    // manual middleware function:
    (neutrino) => {
      // Make whatever configuration overrides needed
    }
  ]
}
```

## Loading middleware

Additional middleware can also be used from a middleware function. This makes their composition simpler for
consumers.

```js
const { EnvironmentPlugin } = require('webpack');

// Export a function which, when called, returns a middleware function.
module.exports = (additionalEnvs = []) => (neutrino) => {
  neutrino.config
    .plugin('env')
    .use(EnvironmentPlugin, ['NODE_ENV', ...additionalEnvs]);
};
```

```js
const envLoader = require('neutrino-middleware-env-loader');

module.exports = neutrino => {
  neutrino.use(envLoader(['SECRET_KEY']));
  neutrino.use(/* next middleware */);
  neutrino.use(/* next middleware */)
};
```

## Distributing

If you would like your middleware to be used by others, feel free to publish and distribute! By putting your middleware
on npm, GitHub, or another location, you can share the hard work put into abstracting away Neutrino and webpack
interactions and save everyone in the community time and effort. As long as the Neutrino CLI, other middleware, or
presets can require your middleware, it puts no restrictions on where you want to host it.

## Core middleware

Neutrino maintains a number of core middleware packages which aid in creating the various preset packages we also
distribute. Continue onward for documentation on these various middleware packages.
