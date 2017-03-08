# Neutrino HTML Template Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-html-template` is Neutrino middleware for automatically creating HTML files for configured
entry-points.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

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
```

## Customization

`neutrino-middleware-html-template` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `html`: Automatically generates HTML files for configured entry-points.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-html-template.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-html-template.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-html-template
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
