# Neutrino Dev Server Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-dev-server` is Neutrino middleware for starting a Webpack Dev Server for fast development cycles.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-dev-server` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-dev-server
```

#### npm

```bash
❯ npm install --save neutrino-middleware-dev-server
```

## Usage

`neutrino-middleware-dev-server` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const devServer = require('neutrino-middleware-dev-server');

// Usage with default options
neutrino.use(devServer);

// Usage with custom options (default options are shown)
neutrino.use(devServer, { 
  public: false,
  https: false,
  port: 5000,
  open: false
});
```

By default this middleware will start a development server with the hot reload support on `http://localhost:5000`. To enable Hot Module Replacement read the documentation of your framework of choise or documentation of corresponding Neutrino preset or middlware.

It is recommended to call this middlware only in development mode when `process.env.NODE_ENV === 'development'`. More imformation about usage of Neutrino middlwares can be found in the [documentation](https://neutrino.js.org/middleware).

## Customization

`neutrino-middleware-dev-server` optionally accepts an object with several options to override the default behavior.

* `public`: Optional boolean value that makes the server accessible in local network using current machine local IP. Default is `false`.
* `https`: Optional boolean value that swithches hosting to HTTPS protocol with fake certificate. Default is `false`.
* `port`:  Optional naumber value of the custom port. Default is `5000`.
* `open`:  Optional boolean value to open the project in the new tab of the default browser. Default is `false`.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-dev-server.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-dev-server.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-dev-server
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
