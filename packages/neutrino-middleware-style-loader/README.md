# Neutrino Style Loader Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-style-loader` is Neutrino middleware for loading and importing stylesheets from modules.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-style-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-style-loader
```

#### npm

```bash
❯ npm install --save neutrino-middleware-style-loader
```

## Usage

`neutrino-middleware-style-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const styles = require('neutrino-middleware-style-loader');

neutrino.use(styles);
```

## Customization

`neutrino-middleware-style-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `css`: Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css` which use
`style-loader` and `css-loader`, respectively.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-style-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-style-loader.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-style-loader
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
