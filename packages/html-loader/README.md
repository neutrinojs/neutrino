# Neutrino HTML Loader Middleware

`@neutrinojs/html-loader` is Neutrino middleware for loading and importing HTML files from modules.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9
- webpack 4

## Installation

`@neutrinojs/html-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/html-loader
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/html-loader
```

## Usage

`@neutrinojs/html-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const html = require('@neutrinojs/html-loader');

// Use with default options
neutrino.use(html);

// Usage showing default options
neutrino.use(html, {
  attrs: ['img:src', 'link:href']
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/html-loader']
};

// Usage showing default options
module.exports = {
  use: [
    ['@neutrinojs/html-loader', {
      attrs: ['img:src', 'link:href']
    }]
  ]
};
```

The options object passed to this middleware will be passed as options to the html-loader used to load HTML files.

## Customization

`@neutrinojs/html-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | NODE_ENV |
| --- | --- | --- |
| `html` | Allows importing HTML files from modules. Contains a single loader named `html`. | all |

## Contributing

This middleware is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/html-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/html-loader.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/html-loader
