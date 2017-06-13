# Neutrino Banner Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-banner` is Neutrino middleware for injecting string content into source code files.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

## Installation

`neutrino-middleware-banner` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-banner
```

#### npm

```bash
❯ npm install --save neutrino-middleware-banner
```

## Usage

`neutrino-middleware-banner` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format:
const banner = require('neutrino-middleware-banner');

// Use with default options
neutrino.use(banner);

// Also accepts options for Webpack's BannerPlugin
// https://webpack.js.org/plugins/banner-plugin/

// Usage shows the default values of this middleware:
neutrino.use(banner, {
  banner: `require('source-map-support').install();`,
  raw: true,
  entryOnly: true
});
```

```js
// Using object or array middleware format:
const banner = require('neutrino-middleware-banner');

// Use with default options
module.exports = {
  use: ['neutrino-middleware-banner']
};

// Also accepts options for Webpack's BannerPlugin
// https://webpack.js.org/plugins/banner-plugin/

// Usage shows the default values of this middleware:
module.exports = {
  use: [
    ['neutrino-middleware-banner', {
      banner: `require('source-map-support').install();`,
      raw: true,
      entryOnly: true
    }]
  ]
};
```

## Customization

`neutrino-middleware-banner` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `banner` | Injects string content into application source code. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](../../contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-banner.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-banner.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-banner
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
