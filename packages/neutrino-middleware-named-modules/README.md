# Neutrino Named Modules Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-named-modules` is Neutrino middleware for enabling named modules output via `NamedModulesPlugin`.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-named-modules` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-named-modules
```

#### npm

```bash
❯ npm install --save neutrino-middleware-named-modules
```

## Usage

`neutrino-middleware-named-modules` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const namedModules = require('neutrino-middleware-named-modules');

neutrino.use(namedModules);
```

## Customization

`neutrino-middleware-named-modules` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `named-modules`: Enables named modules for improved debugging and console output.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-named-modules.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-named-modules.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-named-modules
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
