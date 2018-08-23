# Neutrino Image Loader Middleware

`@neutrinojs/image-loader` is Neutrino middleware for loading and importing image files from modules.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/image-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/image-loader
```

#### npm

```bash
❯ npm install --save @neutrinojs/image-loader
```

## Usage

`@neutrinojs/image-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const images = require('@neutrinojs/image-loader');

// Use with default options
neutrino.use(images);

// Usage showing default options
neutrino.use(images, {
  limit: 8192,
  name: process.env.NODE_ENV === 'production' ? '[name].[hash:8].[ext]' : '[name].[ext]'
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/image-loader']
};

// Usage showing default options
module.exports = {
  use: [
    ['@neutrinojs/image-loader', {
      limit: 8192,
      name: process.env.NODE_ENV === 'production' ? '[name].[hash:8].[ext]' : '[name].[ext]'
    }]
  ]
};
```

- `limit`: Return a Data URL instead of outputting a file, if the file is smaller than a byte limit.
- `name`: The template used by `file-loader` to determine the output filename.

## Customization

`@neutrinojs/image-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `image` | Allows importing ICO, JPEG, PNG, GIF, SVG and WEBP files from modules. Contains a single loader named `url`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/image-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/image-loader.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/image-loader
