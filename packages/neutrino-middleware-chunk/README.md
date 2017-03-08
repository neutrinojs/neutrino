# Neutrino Chunk Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-chunk` is Neutrino middleware for optimizing Webpack bundles via `CommonsChunkPlugin`.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-chunk` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-chunk
```

#### npm

```bash
❯ npm install --save neutrino-middleware-chunk
```

## Usage

`neutrino-middleware-chunk` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const chunk = require('neutrino-middleware-chunk');

// Use with default options
neutrino.use(chunk);

// Also accepts options for Webpack's CommonsChunkPlugin
// https://webpack.js.org/plugins/commons-chunk-plugin/

// Usage shows the default values of this middleware:
neutrino.use(chunk, {
  minChunks: Infinity,
  names: ['vendor', 'manifest']
});
```

## Customization

`neutrino-middleware-chunk` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `chunk`: Creates a separate file (known as a chunk), consisting of common modules shared between multiple entry
points.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-chunk.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-chunk.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-chunk
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
