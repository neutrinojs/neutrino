# Neutrino Image Loader Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-image-loader` is Neutrino middleware for loading and importing image files from modules.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-image-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-image-loader
```

#### npm

```bash
❯ npm install --save neutrino-middleware-image-loader
```

## Usage

`neutrino-middleware-image-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const images = require('neutrino-middleware-image-loader');

// Use with default options
neutrino.use(images);

// Usage showing default options
neutrino.use(images, {
  limit: 8192,
  svg: {},
  img: {},
  ico: {}
});
```

- `limit`: Return a Data URL if the file is smaller than a byte limit.
- `svg`: Set options for the svg-url-loader used when loading svg files.
- `img`: Set options for the url-loader used when loading png, jpeg, and gif files.
- `ico`: Set options for the url-loader used when loading ico files.

## Customization

`neutrino-middleware-image-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `img`: Allows importing JPEG, PNG, and GIF files from modules. Contains a single loader named `url`.
- `svg`: Allows importing SVG files from modules. Contains a single loader named `url`.
- `ico`: Allows importing ICO files from modules. Contains a single loader named `url`.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-image-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-image-loader.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-image-loader
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
