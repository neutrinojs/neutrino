# Neutrino Chunk Middleware

`@neutrinojs/chunk` is Neutrino middleware for optimizing webpack bundles via `CommonsChunkPlugin`.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/chunk` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/chunk
```

#### npm

```bash
❯ npm install --save @neutrinojs/chunk
```

## Usage

`@neutrinojs/chunk` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const chunk = require('@neutrinojs/chunk');

neutrino.use(chunk);
```

```js
// Using object or array middleware format

module.exports = {
  use: ['@neutrinojs/chunk']
};
```

## Customization

`@neutrinojs/chunk` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `named-modules` | Enables named modules for improved debugging and console output. | all |
| `named-chunks` | Enables named chunks for improved debugging and console output. | all |
| `vendor-chunk` | Creates a separate file/chunk consisting of common modules shared between multiple entry points. | all |
| `runtime-chunk` | Creates a separate file/chunk consisting of the webpack manifest-specific code. | all |
| `name-all` | Names all remaining modules that do not get named via `named-modules`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/chunk.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/chunk.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/chunk
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
