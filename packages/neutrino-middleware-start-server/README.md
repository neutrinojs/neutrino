# Neutrino Start Server Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-start-server` is Neutrino middleware for starting a Node.js server for a file upon
completion of a build.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

## Installation

`neutrino-middleware-start-server` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-start-server
```

#### npm

```bash
❯ npm install --save neutrino-middleware-start-server
```

## Usage

`neutrino-middleware-start-server` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const server = require('neutrino-middleware-start-server');

// Use with default options, starting the server
// for the main entry point, neutrino.options.entry
neutrino.use(server);

// Usage with custom server file to start
neutrino.use(server, { name: 'custom.js' });
```

```js
// Using object or array middleware format

// Use with default options, starting the server
// for the main entry point, neutrino.options.entry
module.exports = {
  use: ['neutrino-middleware-start-server']
};

// Usage with custom server file to start
module.exports = {
  use: [
    ['neutrino-middleware-start-server', {
      name: 'custom.js'
    }]
  ]
};
```

By default this middleware will start a server with the single entry point configured in Neutrino.
This middleware optionally accepts an object with a `name` property for a path to a module which to start the server.

## Customization

`neutrino-middleware-start-server` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `start-server` | Start a Node.js for a configured entry point or specified file. | all |

### Debugging

You can start the Node.js server in `inspect` mode to debug the process by setting `neutrino.options.debug` to `true`.
This can be done from the [API](https://neutrino.js.org/api#optionsdebug) or the
[CLI using `--debug`](https://neutrino.js.org/cli#-debug).

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-start-server.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-start-server.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-start-server
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
