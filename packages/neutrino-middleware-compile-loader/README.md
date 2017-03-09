# Neutrino Compile Loader Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-compile-loader` is Neutrino middleware for compiling source code with Babel.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-compile-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-compile-loader
```

#### npm

```bash
❯ npm install --save neutrino-middleware-compile-loader
```

## Usage

`neutrino-middleware-compile-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const compile = require('neutrino-middleware-compile-loader');

neutrino.use(compile, {
  include: [],
  exclude: [],
  babel: {}
});
```

- `include` should be an array of paths to include in the compilation. Maps to Webpack's
[`Rule.include`](https://webpack.js.org/configuration/module/#rule-include)
- `babel` is a [Babel configuration object](https://babeljs.io/docs/usage/api/#options), consumed by babel-loader. Use
this to set properties such as `presets`, `plugins`, and `env`.

## Customization

`neutrino-middleware-compile-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `compile`: Compiles JS and JSX files from the `src` directory using Babel. Contains a single loader named `babel`.

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-compile-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-compile-loader.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-compile-loader
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
