# Neutrino Babel Minify Middleware

`@neutrinojs/babel-minify` is Neutrino middleware for minifying source code using
[`BabelMinifyWebpackPlugin`](https://www.npmjs.com/package/babel-minify-webpack-plugin). This middleware is usually only
added during production builds.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/babel-minify` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/babel-minify
```

#### npm

```bash
❯ npm install --save @neutrinojs/babel-minify
```

## Usage

`@neutrinojs/babel-minify` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const minify = require('@neutrinojs/babel-minify');

// Use with default options
neutrino.use(minify);

// Usage showing overriding minification options
neutrino.use(minify, {
  minify: {},
  plugin: {}
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/babel-minify']
};

// Usage showing overriding minification options
module.exports = {
  use: [
    ['@neutrinojs/babel-minify', {
      minify: {},
      plugin: {}
    }]
  ]
};
```

The `minify` and `plugin` properties map to the options defined by
[babel-minify-webpack-plugin](https://github.com/webpack-contrib/babel-minify-webpack-plugin#options).

## Customization

`@neutrinojs/babel-minify` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `babel-minify` | Minifies source code using `BabelMinifyWebpackPlugin`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/babel-minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/babel-minify.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/babel-minify
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
