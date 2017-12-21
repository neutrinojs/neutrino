# Neutrino Hot Middleware

`@neutrinojs/hot` is Neutrino middleware for enabled Hot Module Replacement with webpack's
`HotModuleReplacementPlugin`. This middleware is usually only added during development.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/hot` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/hot
```

#### npm

```bash
❯ npm install --save @neutrinojs/hot
```

## Usage

`@neutrinojs/hot` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const hot = require('@neutrinojs/hot');

neutrino.use(hot);
```

```js
// Using object or array middleware format
module.exports = {
  use: ['@neutrinojs/hot']
};
```

## Customization

`@neutrinojs/hot` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `hot` | Enables Hot Module Replacement. | all |
| `named-modules` | Enables named modules for improved debugging and console output. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/hot.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/hot.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/hot
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
