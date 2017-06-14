# Neutrino Style Loader Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-style-loader` is Neutrino middleware for loading and importing stylesheets from modules.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

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
// Using function middleware format
const styles = require('neutrino-middleware-style-loader');

// Use with default options
neutrino.use(styles);

// Usage showing default options
neutrino.use(styles, {
  style: {},
  css: {}
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['neutrino-middleware-style-loader']
};

// Usage showing default options
module.exports = {
  use: [
    ['neutrino-middleware-style-loader', {
      style: {},
      css: {}
    }]
  ]
};
```

- `style`: Set options for the style-loader used when loading CSS files.
- `css`: Set options for the css-loader used when loading CSS files.

## Customization

`neutrino-middleware-style-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `css` | Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css` which use `style-loader` and `css-loader`, respectively. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-style-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-style-loader.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-style-loader
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
