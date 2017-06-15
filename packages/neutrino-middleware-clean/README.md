# Neutrino Clean Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-clean` is Neutrino middleware for removing directories before building.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

## Installation

`neutrino-middleware-clean` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-clean
```

#### npm

```bash
❯ npm install --save neutrino-middleware-clean
```

## Usage

`neutrino-middleware-clean` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const clean = require('neutrino-middleware-clean');

// Use with default options
neutrino.use(clean);

// Usage shows the default values of this middleware:
neutrino.use(clean, {
  paths: [],
  root: neutrino.options.root
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['neutrino-middleware-clean']
};

// Usage shows the default values of this middleware:
module.exports = {
  use: [
    ['neutrino-middleware-clean', {
      paths: [],
      root: neutrino.options.root
    }]
  ]
};
```

## Customization

`neutrino-middleware-clean` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `clean` | Removes directories before building. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-clean.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-clean.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-clean
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
