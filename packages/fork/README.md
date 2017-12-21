# Neutrino Fork Middleware

`@neutrinojs/fork` is Neutrino middleware for forking the usage of other middleware into separate processes.
You can combine this with other middleware to configure and build multiple project types from a single project.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/fork` can be installed via the Yarn or npm clients. Inside your project, make sure you have
`neutrino` installed and any other Neutrino middleware are development dependencies.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/fork
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/fork
```

## Details

`@neutrinojs/fork` operates by defining which middleware you wish to split off into separate processes so they
can be run simultaneously. Some typical use cases:

- Building a web app and a Node.js app from the same project
- Build multiple web apps or multiple Node.js apps from the same project
- Generate multiple targets when building libraries

_This middleware must be used in conjunction with a `.neutrinorc.js` file to inform Neutrino of which
middleware should be split into another process. See the [customization docs](https://neutrino.js.org/customization/)
for details on setting up a `.neutrinorc.js` file in your project if you do not already have one._

_Important: The configuration options provided to the fork middleware needs to be serializable across
Node.js processes, which is includes Strings, Numbers, Arrays, Booleans, Objects, Arrays, and more. Using
functions or class instances may not be serializable across processes, such as is the case with some
webpack plugins. If you need to provide these to fork middleware configuration, see the section on serialization
workarounds below._

## Quickstart

After installing Neutrino, your other build middleware, and the fork middleware, open your `.neutrinorc.js` file.
For this example, let's demonstrate building a React app and Node.js app from the same project using different source
directories:

```js
module.exports = {
  use: [
    ['@neutrinojs/fork', {
      configs: {
        react: '@neutrinojs/react',
        node: {
          options: { source: 'server' },
          use: ['@neutrinojs/node']
        }
      }
    }]
  ]
};
```

Let's examine this `.neutrinorc.js` file and see what is happening:

```js
module.exports = {
  // Tell Neutrino to use the following middleware defined
  // in this array
  use: [
    // Use the fork middleware to build configuration
    // into separate processes.
    ['@neutrinojs/fork', {
      // Each process will be defined in "configs".
      // The key in "configs" will be used to identify
      // the forked process. For simplicity, we named
      // these "react" and "node". Therefore, these 2
      // will spawn 2 separate processes, one for the
      // "react" config, and one for the "node" config.
      configs: {
        // The key in "configs" maps to a middleware value.

        // The "react" config uses "@neutrinojs/react" as
        // middleware using the string format. By default,
        // the "react" app's source lives in src/, and builds
        // to build/
        react: '@neutrinojs/react',

        // The "node" config uses the object middleware
        // format to configure Neutrino to build this
        // project from a different directory than the
        // "react" app, using server/ instead of src/, and
        // builds to server-build/
        node: {
          options: { source: 'server', output: 'server-build' },
          use: ['@neutrinojs/node']
        }
      }
    }]
  ]
};
```

Upon starting or building your project, you will now see console messages labeled according to their config ID,
each running in their own process. Quitting Neutrino will cause all forked processes to exit.

```bash
❯ yarn start
[react] ✔ Development server running on: http://localhost:5000
[node] Listening on :3000
[node] ✔ Build completed
[react] ✔ Build completed
```

## Paths

Most middleware attempt to follow the standard [Neutrino project layout](https://neutrino.js.org/project-layout)
to output their compiled output, but building multiple projects at once is bound to cause clashes with
the directories each project uses. This could lead to:

- One target cleaning the output of another target
- One target replacing a file from the output of another target

This has the potential to lead to difficult bugs. As such, it is recommended to change the source and output directory
options to avoid this situation altogether, which the example above demonstrates. If you are certain you want from
and to the same directories, such as when building libraries, ensure you follow any project cleanup instructions
outlined by your middleware.

## Serialization

The configuration options provided to the fork middleware needs to be serializable across
Node.js processes, which is includes Strings, Numbers, Arrays, Booleans, Objects, Arrays, and more. Using
functions or class instances may not be serializable across processes, such as is the case with some
webpack plugins.

For example, let's say you wanted to consume the `webpack-assets-plugin` in your fork middleware options:

```js
// .neutrinorc.js
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  use: [
    ['@neutrinojs/fork', {
      configs: {
        react: {
          use: [
            '@neutrinojs/react',
            (neutrino) => {
              neutrino.config
                .plugin('asset')
                  .use(AssetsPlugin, [/* ... */]);
            }
          ]
        }
      }
    }]
  ]
};
```

This would not work as-is, since the middleware function consuming the `AssetsPlugin` would not be serializable as-is.
To work around this, you can move this middleware function to a separate file, and reference it in the middleware,
which would then get forked and used:

```js
// .neutrinorc.js
module.exports = {
  use: [
    ['@neutrinojs/fork', {
      configs: {
        react: {
          use: [
            '@neutrinojs/react',
            'assets-middleware.js'
          ]
        }
      }
    }]
  ]
};
```

```js
// assets-middleware.js
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = (neutrino) => {
  neutrino.config
    .plugin('asset')
      .use(AssetsPlugin, [/* ... */]);
};
```

## Events

The fork middleware creates a new instance of the Neutrino API for every process spawned.
In order to make use of the Neutrino events that occur in these sub-processes from the parent, Neutrino maps
these events using a `{name}:{event}` convention:

```js
module.exports = {
  use: [
    ['@neutrinojs/fork', {
      configs: {
        react: '@neutrinojs/react',
        node: {
          options: { source: 'server' },
          use: ['@neutrinojs/node']
        }
      }
    }],
    
    // listen for certain events
    (neutrino) => {
      neutrino.on('react:build', () => { /* ... */ });
      neutrino.on('node:start', () => { /* ... */ });
    }
  ]
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/fork.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/fork.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/fork
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
