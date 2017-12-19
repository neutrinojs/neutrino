# Neutrino Minify Middleware

`@neutrinojs/minify` is Neutrino middleware for minifying babel, css, and image assets.

This middleware is usually only added during production builds.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/minify` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/minify
```

#### npm

```bash
❯ npm install --save @neutrinojs/minify
```

## Usage

`@neutrinojs/minify` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const minify = require('@neutrinojs/minify');

// Use with default options
neutrino.use(minify);

// Usage showing overriding middleware options
neutrino.use(minify, {
  babel: {},
  image: {},
  style: {}
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/minify']
};

// Usage showing overriding middleware options
module.exports = {
  use: [
    ['@neutrinojs/minify', {
      babel: {},
      image: {},
      style: {}
    }]
  ]
};
```

## Customization

`@neutrinojs/minify` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Options

- `babel`: Set options for [@neutrinojs/babel-minify](https://neutrino.js.org/packages/babel-minify/README.md).
- `image`: Set options for [@neutrinojs/image-minify](https://neutrino.js.org/packages/image-minify/README.md).
- `style`: Set options for [@neutrinojs/style-minify](https://neutrino.js.org/packages/style-minify/README.md).

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `babel-minify` | Minifies source code using `BabelMinifyWebpackPlugin`. From `@neutrinojs/babel-minify`. | all |
| `imagemin` | Optimize any images added by other webpack plugins (e.g. `copy-webpack-plugin`). From `@neutrinojs/image-minify`. | all |
| `optimize-css` | Minifies css using `OptimizeCssAssetsPlugin`. From `@neutrinojs/style-minify`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/minify.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/minify
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
