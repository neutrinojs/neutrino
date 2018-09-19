# Neutrino Dev Server Middleware

`@neutrinojs/dev-server` is Neutrino middleware for starting a webpack Dev Server for fast development cycles.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9
- webpack 4

## Installation

`@neutrinojs/dev-server` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/dev-server
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/dev-server
```

## Usage

`@neutrinojs/dev-server` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const devServer = require('@neutrinojs/dev-server');

// Usage with default options
neutrino.use(devServer);

// Usage with custom options (default options are shown)
neutrino.use(devServer, {
  https: false,
  port: 5000,
  host: 'localhost',
  public: 'localhost:5000',
  open: false,
  contentBase: neutrino.options.source,
  hot: true,
  historyApiFallback: true,
  publicPath: '/',
  headers: {
    host: 'localhost:5000'
  },
  stats: {
    assets: false,
    children: false,
    chunks: false,
    colors: true,
    errors: true,
    hash: false,
    modules: false,
    publicPath: false,
    timings: false,
    version: false,
    warnings: true
  }
});
```

```js
// Using object or array middleware format

// Usage with default options
module.exports = {
  use: ['@neutrinojs/dev-server']
};

// Usage with custom options (default options are shown)
module.exports = {
  use: [
    ['@neutrinojs/dev-server', {
      https: false,
      port: 5000,
      host: 'localhost',
      public: 'localhost:5000',
      open: false,
      contentBase: neutrino.options.source,
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      headers: {
        host: 'localhost'
      },
      stats: {
        assets: false,
        children: false,
        chunks: false,
        colors: true,
        errors: true,
        hash: false,
        modules: false,
        publicPath: false,
        timings: false,
        version: false,
        warnings: true
      }
    }]
  ]
};
```

By default this middleware will start a development server with Hot Module Replacement support on
`http://localhost:5000`. To enable HMR with your application, read the documentation of corresponding Neutrino
preset or middleware.

It is recommended to call this middleware only in development mode when `process.env.NODE_ENV === 'development'`.
More information about usage of Neutrino middleware can be found in the [documentation](https://neutrinojs.org/middleware/).

## Middleware options

`@neutrinojs/dev-server` optionally accepts an object with several options to override the default behavior.
This object, as seen used above, can accept any
[property that is accepted by webpack Dev Server](https://webpack.js.org/configuration/dev-server/).

## Contributing

This middleware is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/dev-server.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/dev-server.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/dev-server
