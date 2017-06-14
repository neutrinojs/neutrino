# Neutrino Hot Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-hot` is Neutrino middleware for enabled Hot Module Replacement with Webpack's
`HotModuleReplacementPlugin`. This middleware is usually only added during development.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

## Installation

`neutrino-middleware-hot` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-hot
```

#### npm

```bash
❯ npm install --save neutrino-middleware-hot
```

## Usage

`neutrino-middleware-hot` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const hot = require('neutrino-middleware-hot');

neutrino.use(hot);
```

```js
// Using object or array middleware format
module.exports = {
  use: ['neutrino-middleware-hot']
};
```

## Customization

`neutrino-middleware-hot` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `hot` | Enables hot module replacement. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-hot.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-hot.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-hot
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
