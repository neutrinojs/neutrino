# Middleware

The basic unit of interacting with Neutrino is middleware. Middleware can modify configuration,
listen for events, get build metadata, or augment Neutrino with custom functionality.

## Formats

Neutrino middleware can be specified in several different formats depending on the complexity and level of
customization needed. The Neutrino API and CLI operate on the concept that they are provided a collection of middleware.
Specifically:

```js
// The Neutrino API can use many middleware when it is run()
neutrino.run('command', [/* array of middleware */])

// When no middleware has been specified to run, it defaults
// to an array only containing the local .neutrinorc.js file
neutrino.run('command')
```

```bash
# The Neutrino CLI can use many middleware when running a command
❯ neutrino command --use middleware_a middleware_b

# When no middleware has been specified to the CLI, it defaults
# to an array only containing the local .neutrinorc.js file
❯ neutrino command
```

Each item in these collections can be provided in a number of different formats. For example, the CLI can only directly
accept string formats, while the API and required middleware can be of any supported format.

The string and array formats are generally used from within the more powerful object and function formats.

### String format

Providing a string as a middleware item denotes it as being a require-able module. Neutrino will attempt to require
this string and then try to use its exports as another middleware format. For example, using the string
"neutrino-preset-react" will be required by Neutrino, and then be re-processed through Neutrino using its exports as a
different middleware type, depending on what that preset exported.

Using the string format is most commonly used to depend on other middleware. Referencing a string does not enable
access to the Neutrino API, and options can only be passed to the string middleware if using the Neutrino API's `use`
method.

```bash
# String format on the CLI
❯ neutrino start --use neutrino-preset-react
```

```js
// String format exported from other middleware
// not very useful, but possible
module.exports = 'neutrino-preset-react';
```

```js
// String format being used within an object-format .neutrinorc.js
module.exports = {
  use: ['neutrino-preset-react']
};
```

```js
// String format being used within function format
module.exports = neutrino => {
  neutrino.use('neutrino-preset-react');
  neutrino.use('neutrino-preset-react', {
    devServer: { port: 3000 }
  });
};
```

### Array format

Providing an array as a middleware item denotes it as being a pair of middleware format and options, i.e.
`[middleware, options]`. The first item in the pair can be any other middleware format, although it is typically
specified as a string to require, and options to be passed to the required middleware.

Using the array format is most commonly used to depend on other middleware while being able to supply options to the
required middleware. Referencing an array does not enable access to the Neutrino API.

```js
// Array format exported from other middleware
// still not very useful, but possible
module.exports = ['neutrino-preset-react', { devServer: { port: 3000 } }];
```

```js
// Array format being used within an object-format .neutrinorc.js
module.exports = {
  use: [
    ['neutrino-preset-react', {
      devServer: { port: 3000 }
    }]
  ]
};
```

```js
// Array format being used within an object-format .neutrinorc.js
module.exports = {
  use: [
    ['neutrino-preset-react', {
      devServer: { port: 3000 }
    }]
  ]
};
```

```js
// Array format being used within function format
module.exports = neutrino => {
  neutrino.use(['neutrino-preset-react']);
  neutrino.use(['neutrino-preset-react', {
    devServer: { port: 3000 }
  }]);
};
```

### Object format

Providing an object as a middleware item denotes it as being a more complex middleware structure capable of
overriding configuration and options. The object format is the recommended format when creating `.neutrinorc.js` files
as it provides a good balance between easily setting options and using other middleware. The object format can be
structured as follows:

```js
module.exports = {
  // specify options to override in the Neutrino API
  options: {
    // for example, change the output directory to dist
    output: 'dist',
    // or set the default development port to 3000
    port: 3000
  },
  
  // Specify environment-specific changes. This is a key-value
  // mapping of environment variable names to their matching values
  // during which to override. The matching environment value can
  // be any middleware format
  env: {
    NODE_ENV: {
      // Require minify middleware during production
      production: 'neutrino-middleware-minify',
      
      // Use dev-server during development
      development: ['neutrino-middleware-dev-server', { port: 3000 }],
      
      // Use Jest during test-only
      test: {
        use: ['neutrino-preset-jest']
      }
    },
    
    CSS_MODULES: {
      // Turn on CSS modules when the environment variable CSS_MODULES=enable
      enable: (neutrino) => {
        neutrino.config.module
          .rule('style')
            .use('css')
              .options({ modules: true });
      }
    }
  },
  
  // The "use" array defines another set of middleware for Neutrino to use.
  // Just like the CLI and API start with a collection of middleware to use,
  // providing a "use" array specifies another list of middleware formats to work with
  use: [
    // string format
    'neutrino-preset-airbnb-base',
    
    // array format
    ['neutrino-preset-react', { polyfills: { babel: false } }],
    
    // function format
    (neutrino) => {
      // Make whatever configuration overrides needed
    }
  ]
}
```

Hopefully it is clear that the object format is quite powerful, and although it doesn't give you direct access to the
Neutrino API, providing a function format **within does** give you API access.

### Function format

The most powerful middleware format. Using a function as middleware gives direct access to the Neutrino API, configuration,
options, and events for modification, as well as being able to accept options for driving the behavior of the middleware.

```js
function middleware(neutrino, options) {}
```

A middleware function can optionally accept an `options` argument which will be fed back into
the middleware function when used. The options argument can be whatever value you accept.

If you're familiar with middleware from the Express/connect world, this works similarly. When using Express middleware,
you provide a function to Express which receives arguments to modify a request or response along its lifecycle. There
can be a number of middleware functions that Express can load, each one potentially modifying a request or response in
succession. Neutrino will execute middleware functions similarly, where each function successively interacts with Neutrino along
the lifecycle.

To use a concrete example, let's create middleware that adds an environment plugin:

```js
const { Neutrino } = require('neutrino');
const { EnvironmentPlugin } = require('webpack');

module.exports = (neutrino, additionalVars = []) => {
  neutrino.config
    .plugin('env')
    .use(EnvironmentPlugin, ['NODE_ENV', ...additionalVars]);
};

// When this middleware gets used, options can be passed to it
// depending on the format:

module.exports = {
  use: [
    'your-env-middleware',
    
    ['your-env-middleware', ['CSS_MODULES']],
    
    (neutrino) => neutrino.use('your-env-middleware', ['CSS_MODULES'])
  ]
};
```

## Loading middleware

Additional middleware can also be loaded from a middleware function. This makes their composition simpler for
consumers.

```js
// neutrino-middleware-env
const { EnvironmentPlugin } = require('webpack');

module.exports = (neutrino, additionalVars = []) => neutrino.config
  .plugin('env')
  .use(EnvironmentPlugin, ['NODE_ENV', ...additionalVars]);
```

```js
// react preset (which is also middleware)
const env = require('neutrino-middleware-env');

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
      .plugin(pluginName)
      .use(EnvironmentPlugin, ['NODE_ENV', ...additionalVars]);
};
```

```js
// react preset (which is also middleware)
const env = require('neutrino-middleware-env');

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
