# Neutrino Clean Middleware

`@neutrinojs/clean` is Neutrino middleware for removing directories before building.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9
- webpack 4

## Installation

`@neutrinojs/clean` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/clean
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/clean
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
  verbose: neutrino.options.debug,
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
      verbose: neutrino.options.debug,
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

| Name | Description | NODE_ENV |
| --- | --- | --- |
| `clean` | Removes directories before building. | all |

## Contributing

This middleware is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/clean.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/clean.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/clean
