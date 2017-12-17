# Neutrino PWA Middleware

`@neutrinojs/pwa` is Neutrino middleware for augmenting a Neutrino web application with Progressive Web
Application capabilities. This middleware is usually only added during production builds.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/pwa` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/pwa
```

#### npm

```bash
❯ npm install --save @neutrinojs/pwa
```

## Usage

`@neutrinojs/pwa` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const pwa = require('@neutrinojs/pwa');

// Use with default options
neutrino.use(pwa);

// Usage showing overriding options
neutrino.use(pwa, {
  relativePaths: true,
  // Override pluginId to add an additional pwa plugin instance
  pluginId: 'pwa'
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/pwa']
};

// Usage showing overriding options
module.exports = {
  use: [
    ['@neutrinojs/pwa', {
      relativePaths: true,
      // Override pluginId to add an additional pwa plugin instance
      pluginId: 'pwa'
    }]
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
❯ neutrino build --use @neutrinojs/react @neutrinojs/pwa
```

_Example: Only use middleware during production:_

```js
module.exports = {
  env: {
    NODE_ENV: {
      production: {
        use: ['@neutrinojs/pwa']
      }
    }
  }
};
```

_Example: Only use middleware during production:_

```js
const pwa = require('@neutrinojs/pwa');

neutrino.config.when(process.env.NODE_ENV === 'production', () => {
  neutrino.use(pwa);
});
```

## Customization

`@neutrinojs/pwa` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `pwa` | Creates an `OfflinePlugin` with options for setting up caching via Service Worker. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/pwa.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/pwa.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/pwa
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
