# Neutrino stylelint Middleware

`@neutrinojs/stylelint` is Neutrino middleware for linting styles using stylelint.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9
- webpack 4
- Stylelint 8

## Installation

`@neutrinojs/stylelint` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/stylelint stylelint@^8
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/stylelint stylelint@^8
```

## Usage

`@neutrinojs/stylelint` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const stylelint = require('@neutrinojs/stylelint');

// Usage shows default values
neutrino.use(stylelint, {
  pluginId: 'stylelint',
  configBasedir: neutrino.options.root,
  files: '**/*.+(css|scss|sass|less)',
  context: neutrino.options.source,
  failOnError: process.env.NODE_ENV !== 'development',
  formatter: require('stylelint').formatters.string
});
```

Options are passed to `stylelint-webpack-plugin`. See the [stylelint Node API](https://stylelint.io/user-guide/node-api/#options) for all available options.

## Information

By default this middleware will show errors and warnings in the console during development, and will cause a failure when
creating a build bundle.

## stylelintrc Config

`@neutrinojs/styelint`, provides an `.stylelintrc()` output handler for generating the Stylelint
configuration in a format suitable for use in an `.stylelintrc.js` file. This allows the
Stylelint CLI to be used outside of building the project, and for IDEs and text editors to
provide linting hints/fixes.

Create a `.stylelintrc.js` file in the root of the project, containing:

```js
// .stylelintrc.js
const neutrino = require('neutrino');

module.exports = neutrino().stylelintrc();
```

This `.stylelintrc.js` configuration will be automatically used when running the Stylelint CLI.
For convenience a `lint:style` script alias can be added to your `package.json`, allowing linting
to be run via `yarn lint:style` or `npm run lint:style`:

```json
{
  "scripts": {
    "lint": "stylelint \"src/**/*.css\""
  }
}
```

## Contributing

This middleware is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/stylelint.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/stylelint.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/stylelint
