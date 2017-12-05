# Neutrino Minify Middleware

`@neutrinojs/minify` is Neutrino middleware for minifying assets. It is an aggregate of the following middlewares:

- [@neutrinojs/babel-minify](https://neutrino.js.org/packages/babel-minify/README.md)
- [@neutrinojs/image-minify](https://neutrino.js.org/packages/image-minify/README.md)

This middleware is usually only added during production builds.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7

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
  image: {}
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
      image: {}
    }]
  ]
};
```

## Customization

`@neutrinojs/minify` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

See the following middlewares for added plugins and rules:

- [@neutrinojs/babel-minify](https://neutrino.js.org/packages/babel-minify/README.md)
- [@neutrinojs/image-minify](https://neutrino.js.org/packages/image-minify/README.md)

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/minify.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/minify
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
