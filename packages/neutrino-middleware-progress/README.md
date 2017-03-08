# Neutrino Progress Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-progress` is Neutrino middleware for displaying a progress bar showing the progress of a build.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-progress` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-progress
```

#### npm

```bash
❯ npm install --save neutrino-middleware-progress
```

## Usage

`neutrino-middleware-progress` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const progress = require('neutrino-middleware-progress');

neutrino.use(progress);
```

## Customization

`neutrino-middleware-progress` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `progress`: Displays a bar showing progression of build.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-progress.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-progress.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-progress
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
