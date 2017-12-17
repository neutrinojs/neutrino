# Neutrino Style Minify Middleware

`@neutrinojs/style-minify` is Neutrino middleware for minifying styles using
[`OptimizeCssAssetsPlugin`](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin). This middleware is usually only
added during production builds.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/style-minify` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/style-minify
```

#### npm

```bash
❯ npm install --save @neutrinojs/style-minify
```

## Usage

`@neutrinojs/style-minify` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const styleMinify = require('@neutrinojs/style-minify');

// Use with default options
neutrino.use(styleMinify);

// Usage showing overriding options
neutrino.use(styleMinify, {
  pluginId: 'optimize-css',
  plugin: {
    assetNameRegExp: /\.css$/g,
    cssProcessorOptions: {},
    canPrint: true,
  }
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/style-minify']
};

// Usage showing overriding options
module.exports = {
  use: [
    ['@neutrinojs/style-minify', {
      pluginId: 'optimize-css',
      plugin: {
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {},
        canPrint: true,
      }
    }]
  ]
};
```

The `plugin` property is passed to [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin#configuration).

## Customization

`@neutrinojs/style-minify` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `optimize-css` | Minifies css using `OptimizeCssAssetsPlugin`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/style-minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/style-minify.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/style-minify
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
