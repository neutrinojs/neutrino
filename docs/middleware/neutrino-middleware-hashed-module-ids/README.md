# Neutrino Hashed Module IDs Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-hashed-module-ids` is Neutrino middleware for removing directories before building.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v6

## Installation

`neutrino-middleware-hashed-module-ids` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-hashed-module-ids
```

#### npm

```bash
❯ npm install --save neutrino-middleware-hashed-module-ids
```

## Usage

`neutrino-middleware-hashed-module-ids` can be consumed from the Neutrino API, middleware, or presets. Require this
package and plug it into Neutrino:

```js
const hashedModuleIds = require('neutrino-middleware-hashed-module-ids');

// Use with default options
neutrino.use(hashedModuleIds);
```

## Customization

`neutrino-middleware-hashed-module-ids` creates some conventions to make overriding the configuration easier if you
need to make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `hashed-ids`: Generates a module ID based on the hashing of the module contents.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](../../contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-hashed-module-ids.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-hashed-module-ids.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-hashed-module-ids
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
