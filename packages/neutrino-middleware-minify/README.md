# Neutrino Minify Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-minify` is Neutrino middleware for minifying source code using
[`BabiliWebpackPlugin`](https://www.npmjs.com/package/babili-webpack-plugin). This middleware is usually only
added during production builds.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-minify` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-minify
```

#### npm

```bash
❯ npm install --save neutrino-middleware-minify
```

## Usage

`neutrino-middleware-minify` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const minify = require('neutrino-middleware-minify');

// Use with default options
neutrino.use(minify);

// Usage showing overriding minification options
neutrino.use(minify, {
  babili: {},
  overrides: {}
});
```

The `babili` and `overrides` properties map to the options defined by
[babili-webpack-plugin](https://www.npmjs.com/package/babili-webpack-plugin#options).

## Customization

`neutrino-middleware-minify` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `minify`: Minifies source code using `BabiliWebpackPlugin`.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-minify.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-minify
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
