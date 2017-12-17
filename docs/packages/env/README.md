# Neutrino Environment Middleware

`@neutrinojs/env` is Neutrino middleware for injecting environment variable definitions into
source code at `process.env`. You can use this to make a custom environment variable (e.g. an API server backend to
use) available inside your project. Always injects `process.env.NODE_ENV`, unless overridden.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/env` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/env
```

#### npm

```bash
❯ npm install --save @neutrinojs/env
```

## Usage

`@neutrinojs/env` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const env = require('@neutrinojs/env');

// Use with default options
neutrino.use(env);

// Usage with additional environment variables
neutrino.use(env, ['SECRET_KEY']);
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/env']
};

// Usage with additional environment variables
module.exports = {
  use: [
    ['@neutrinojs/env', ['SECRET_KEY']]
  ]
};
```

This middleware optionally accepts an array of environment variables to additionally inject into source code.

## Customization

`@neutrinojs/env` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `env` | Inject environment variables into source code at `process.env`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/env.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/env.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/env
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
