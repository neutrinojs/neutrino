# Neutrino Dev Server Middleware

`@neutrinojs/dev-server` is Neutrino middleware for starting a webpack Dev Server for fast development cycles.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/dev-server` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/dev-server
```

#### npm

```bash
❯ npm install --save @neutrinojs/dev-server
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
  public: 'localhost',
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
    errorDetails: true,
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
      public: 'localhost',
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
        errorDetails: true,
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
More information about usage of Neutrino middleware can be found in the [documentation](https://neutrino.js.org/middleware).

## Middleware options

`@neutrinojs/dev-server` optionally accepts an object with several options to override the default behavior.
This object, as seen used above, can accept any
[property that is accepted by webpack Dev Server](https://webpack.js.org/configuration/dev-server/). In addition, you
may also specify the following options:

- `open`:  Optional Boolean value to open the project in the a tab of the default browser. Default is `false`.

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/dev-server.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/dev-server.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/dev-server
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
