# Neutrino HTML Template Middleware

`@neutrinojs/html-template` is Neutrino middleware for automatically creating HTML files for configured
entry points.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/html-template` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/html-template
```

#### npm

```bash
❯ npm install --save @neutrinojs/html-template
```

## Usage

`@neutrinojs/html-template` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const template = require('@neutrinojs/html-template');

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
  },
  // Override pluginId to add an additional html-template plugin instance
  pluginId: 'html'
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
    ['@neutrinojs/html-template', {
      inject: false,
      appMountId: 'root',
      xhtml: true,
      mobile: true,
      minify: {
        useShortDoctype: true,
        keepClosingSlash: true,
        collapseWhitespace: true,
        preserveLineBreaks: true
      },
      // Override pluginId to add an additional html-template plugin instance
      pluginId: 'html'
    }]
  ]
};

// Most commonly, you will want to override the initial page title:
module.exports = {
  use: [
    ['@neutrinojs/html-template', {
      title: 'React Application'
    }]
  ]
};
```

## Customization

`@neutrinojs/html-template` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `html` | Automatically generates HTML files for configured entry points. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/html-template.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/html-template.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/html-template
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
