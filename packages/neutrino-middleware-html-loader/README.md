# Neutrino HTML Loader Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-html-loader` is Neutrino middleware for loading and importing HTML files from modules.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-html-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-html-loader
```

#### npm

```bash
❯ npm install --save neutrino-middleware-html-loader
```

## Usage

`neutrino-middleware-html-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const html = require('neutrino-middleware-html-loader');

// Use with default options
neutrino.use(html);

// Usage showing default options
neutrino.use(html, {
  name: '[name].[ext]'
});
```

The options object passed to this middleware will be passed as options to the file-loader used to load HTML files.

## Customization

`neutrino-middleware-html-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `html`: Allows importing HTML files from modules. Contains a single loader named `file`.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-html-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-html-loader.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-html-loader
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
