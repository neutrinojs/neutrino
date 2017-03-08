# Middleware

The basic unit of interacting with Neutrino is middleware. In Neutrino, middleware are functions
that are provided a Neutrino instance for the intent of modifying configuration, listening for
events, getting build metadata, or augmenting with custom functionality. At its simplest, a middleware
function accepts a Neutrino instance argument and does nothing:

```js
function middleware(neutrino) {}
```

A middleware function can also optionally accept an `options` argument which will be fed back into
the middleware function when used.

```js
function middleware(neutrino, options) {}
```

The signature of this function is what we call "Neutrino middleware". If you're familiar with middleware from the
Express/connect world, this works similarly. When using Express middleware, you provide a function to Express which
receives arguments to modify a request or response along its lifecycle. There can be a number of middleware functions
that Express can load, each one potentially modifying a request or response in succession.

Neutrino will execute middleware similarly, where each middleware function successively interacts with Neutrino along
the lifecycle. This is done by plugging in the middleware to Neutrino via the `use()` method.

```js
const api = new Neutrino();

api.use(middleware);
api.use(middleware, options);
```

To use a concrete example, let's create middleware that adds an environment plugin:

```js
const Neutrino = require('neutrino');
const { EnvironmentPlugin } = require('webpack');

const api = new Neutrino();

function env(neutrino, additionalVars = []) {
  neutrino.config
    .plugin('env', EnvironmentPlugin, ['NODE_ENV', ...additionalVars]);
}

api.use(env); // or:
api.use(env, ['SECRET_KEY']);
```

## Loading middleware

Additional middleware can also be loaded from a middleware function. This makes their composition simpler for
consumers.

```js
// neutrino-middleware-env
const { EnvironmentPlugin } = require('webpack');

module.exports = (neutrino, additionalVars = []) => neutrino.config
  .plugin('env', EnvironmentPlugin, ['NODE_ENV', ...additionalVars]);
```

```js
// react preset (which is also middleware)
const env = require('./neutrino-middleware-env');

module.exports = neutrino => {
  neutrino.use(env, ['SECRET_KEY']);
  neutrino.use(/* next middleware */);
  neutrino.use(/* next middleware */)
};
```

## Configuring

If your middleware requires configuration _outside_ of the options necessary for _running_ the middleware,
use a closure technique for simplifying this for your middleware consumers. In short, your module will provide a
function to consumers which, when executed, will return a Neutrino middleware function. Describing this in code:

```js
module.exports = function wrapper(...args) {
  return function middleware(neutrino, options) {
    // do something with neutrino, options, and args
  };
};
```

Let's create a contrived example using our `env` middleware. Let's use a closure to let the consumer provide an
alternate plugin name when creating the middleware:

```js
// neutrino-middleware-env
const { EnvironmentPlugin } = require('webpack');

module.exports = (pluginName = 'env') => (neutrino, additionalVars = []) => {
    neutrino.config
      .plugin(pluginName, EnvironmentPlugin, ['NODE_ENV', ...additionalVars]);
};
```

```js
// react preset (which is also middleware)
const env = require('./neutrino-middleware-env');

module.exports = neutrino => {
  neutrino.use(env('ENV-PLUGIN'), ['SECRET_KEY']);
};
```

## Distributing

If you would like your middleware to be used by others, feel free to publish and distribute! By putting your middleware
on npm, GitHub, or another location, you can share the hard work put into abstracting away Neutrino and Webpack
interactions and save everyone in the community time and effort. As long as the Neutrino CLI, other middleware, or
presets can require your middleware, it puts no restrictions on where you want to host it.

## Core middleware

Neutrino maintains a number of core middleware packages which aid in creating the various preset packages we also
distribute. Continue onward for documentation on these various middleware packages.
