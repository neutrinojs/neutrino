# Neutrino Font Loader Middleware

`@neutrinojs/font-loader` is Neutrino middleware for loading and importing font files from modules.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/font-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/font-loader
```

#### npm

```bash
❯ npm install --save @neutrinojs/font-loader
```

## Usage

`@neutrinojs/font-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const fonts = require('@neutrinojs/font-loader');

// Use with default options
neutrino.use(fonts);

// Usage showing default options
neutrino.use(fonts, {
  limit: '10000',
  woff: {},
  ttf: {},
  eot: {}
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/font-loader']
};

// Usage showing default options
module.exports = {
  use: [
    ['@neutrinojs/font-loader', {
      limit: '10000',
      woff: {},
      ttf: {},
      eot: {}
    }]
  ]
};
```

- `limit`: Return a Data URL if the file is smaller than a byte limit.
- `woff`: Set options for the url-loader used when loading woff files.
- `tff`: Set options for the url-loader used when loading ttf files.
- `eot`: Set options for the file-loader used when loading eot files.

## Customization

`@neutrinojs/font-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `woff` | Allows importing WOFF font files from modules. Contains a single loader named `url`. | all |
| `ttf` | Allows importing TTF font files from modules. Contains a single loader named `url`. | all |
| `eot` | Allows importing EOT font files from modules. Contains a single loader named `file`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/font-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/font-loader.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/font-loader
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
