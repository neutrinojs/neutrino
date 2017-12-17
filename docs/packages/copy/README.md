# Neutrino Copy Middleware

`@neutrinojs/copy` is Neutrino middleware for copying files during building.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/copy` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/copy
```

#### npm

```bash
❯ npm install --save @neutrinojs/copy
```

## Usage

`@neutrinojs/copy` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const copy = require('@neutrinojs/copy');

// Use with default options
neutrino.use(copy);

// Usage shows the default values of this middleware:
neutrino.use(copy, {
  patterns: [],
  options: {},
  pluginId: 'copy'
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/copy']
};

// Usage shows the default values of this middleware:
module.exports = {
  use: [
    ['@neutrinojs/copy', {
      patterns: [],
      options: {},
      pluginId: 'copy'
    }]
  ]
};
```

The `patterns` and `options` are defined from the [CopyWebpackPlugin](https://github.com/kevlened/copy-webpack-plugin).
See their docs for details on valid values to specify.

- `patterns`: An array of patterns specifying copy operations.
- `options`: An object specifying copy options.
- `pluginId`: The plugin identifier. Override this to add an additional copy plugin instance.

## Customization

`@neutrinojs/copy` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `copy` |  Copy files during building. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/copy.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/copy.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/copy
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
