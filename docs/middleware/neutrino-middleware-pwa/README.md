# Neutrino PWA Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-pwa` is Neutrino middleware for augmenting a Neutrino web application with Progressive Web
Application capabilities. This middleware is usually only added during production builds.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

## Installation

`neutrino-middleware-pwa` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-pwa
```

#### npm

```bash
❯ npm install --save neutrino-middleware-pwa
```

## Usage

`neutrino-middleware-pwa` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const pwa = require('neutrino-middleware-pwa');

// Use with default options
neutrino.use(pwa);

// Usage showing overriding options
neutrino.use(pwa, {
  relativePaths: true
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['neutrino-middleware-pwa']
};

// Usage showing overriding options
module.exports = {
  use: [
    ['neutrino-middleware-pwa', { relativePaths: true }]
  ]
};
```

The options passed to the PWA middleware are options accepted by
[OfflinePlugin](https://github.com/NekR/offline-plugin). These are merged with the default values supplied by the PWA
middleware using a deep object merge.

## Environment

It is recommended to only use this middleware during building, or the production environment.

_Example: Only use middleware when building:_

```bash
❯ neutrino build --use neutrino-preset-react neutrino-middleware-pwa
```

_Example: Only use middleware during production:_

```js
module.exports = {
  env: {
    NODE_ENV: {
      production: {
        use: ['neutrino-middleware-pwa']
      }
    }
  }
};
```

_Example: Only use middleware during production:_

```js
const pwa = require('neutrino-middleware-pwa');

neutrino.config.when(process.env.NODE_ENV === 'production', () => {
  neutrino.use(pwa);
});
```

## Customization

`neutrino-middleware-pwa` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `pwa` | Creates an `OfflinePlugin` with options for setting up caching via Service Worker. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](../contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-pwa.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-pwa.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-pwa
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
