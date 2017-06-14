# Neutrino Font Loader Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-font-loader` is Neutrino middleware for loading and importing font files from modules.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

## Installation

`neutrino-middleware-font-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-font-loader
```

#### npm

```bash
❯ npm install --save neutrino-middleware-font-loader
```

## Usage

`neutrino-middleware-font-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const fonts = require('neutrino-middleware-font-loader');

// Use with default options
neutrino.use(fonts);

// Usage showing default options
neutrino.use(fonts, {
  limit: '10000',
  woff: {},
  ttf: {},
  eot: {}
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['neutrino-middleware-font-loader']
};

// Usage showing default options
module.exports = {
  use: [
    ['neutrino-middleware-font-loader', {
      limit: '10000',
      woff: {},
      ttf: {},
      eot: {}
    }]
  ]
};
```

- `limit`: Return a Data URL if the file is smaller than a byte limit.
- `woff`: Set options for the url-loader used when loading woff files.
- `tff`: Set options for the url-loader used when loading ttf files.
- `eot`: Set options for the file-loader used when loading eot files.

## Customization

`neutrino-middleware-font-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `woff` | Allows importing WOFF font files from modules. Contains a single loader named `url`. | all |
| `ttf` | Allows importing TTF font files from modules. Contains a single loader named `url`. | all |
| `eot` | Allows importing EOT font files from modules. Contains a single loader named `file`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-font-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-font-loader.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-font-loader
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
