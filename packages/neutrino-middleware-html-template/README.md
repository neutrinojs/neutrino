# Neutrino HTML Template Middleware

`neutrino-middleware-html-template` is Neutrino middleware for automatically creating HTML files for configured
entry-points.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7

## Installation

`neutrino-middleware-html-template` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-html-template
```

#### npm

```bash
❯ npm install --save neutrino-middleware-html-template
```

## Usage

`neutrino-middleware-html-template` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const template = require('neutrino-middleware-html-template');

// Usage shows default values
// Accepts options specified by HtmlWebpackTemplate
// https://github.com/jaketrent/html-webpack-template
neutrino.use(template, {
  inject: false,
  appMountId: 'root',
  xhtml: true,
  mobile: true,
  minify: {
    useShortDoctype: true,
    keepClosingSlash: true,
    collapseWhitespace: true,
    preserveLineBreaks: true
  }
});

// Most commonly, you will want to override the initial page title:
neutrino.use(template, {
  title: 'React Application'
});
```

```js
// Using object or array middleware format

// Usage shows default values
// Accepts options specified by HtmlWebpackTemplate
// https://github.com/jaketrent/html-webpack-template
module.exports = {
  use: [
    ['neutrino-middleware-html-template', {
      inject: false,
      appMountId: 'root',
      xhtml: true,
      mobile: true,
      minify: {
        useShortDoctype: true,
        keepClosingSlash: true,
        collapseWhitespace: true,
        preserveLineBreaks: true
      }
    }]
  ]
};

// Most commonly, you will want to override the initial page title:
module.exports = {
  use: [
    ['neutrino-middleware-html-template', {
      title: 'React Application'
    }]
  ]
};
```

## Customization

`neutrino-middleware-html-template` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `html` | Automatically generates HTML files for configured entry-points. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-html-template.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-html-template.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-html-template
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
