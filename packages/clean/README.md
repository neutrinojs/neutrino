# Neutrino Clean Middleware

`@neutrinojs/clean` is Neutrino middleware for removing directories before building.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/clean` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/clean
```

#### npm

```bash
❯ npm install --save @neutrinojs/clean
```

## Usage

`@neutrinojs/clean` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const clean = require('@neutrinojs/clean');

// Use with default options
neutrino.use(clean);

// Usage shows the default values of this middleware:
neutrino.use(clean, {
  paths: [],
  root: neutrino.options.root,
  // Override pluginId to add an additional clean plugin instance
  pluginId: 'clean'
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/clean']
};

// Usage shows the default values of this middleware:
module.exports = {
  use: [
    ['@neutrinojs/clean', {
      paths: [],
      root: neutrino.options.root,
      // Override pluginId to add an additional banner plugin instance
      pluginId: 'clean'
    }]
  ]
};
```

## Customization

`@neutrinojs/clean` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `clean` | Removes directories before building. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/clean.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/clean.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/clean
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
