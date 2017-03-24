# Neutrino ESLint Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-eslint` is Neutrino middleware for linting source code using ESLint and eslint-loader.

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-middleware-eslint` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-middleware-eslint
```

#### npm

```bash
❯ npm install --save neutrino-middleware-eslint
```

## Usage

`neutrino-middleware-eslint` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
const eslint = require('neutrino-middleware-eslint');

// Usage shows default values
neutrino.use(eslint, {
  test: /\.(js|jsx)$/,
  include: [], /* Should specify either include or exclude */
  exclude: [], /* Should specify either include or exclude */
  eslint: {
    failOnError: process.env.NODE_ENV !== 'development',
     emitWarning: process.env.NODE_ENV !== 'development',
     emitError: process.env.NODE_ENV !== 'development',
     cwd: neutrino.options.root,
     useEslintrc: false,
     root: true,
     plugins: ['babel'],
     baseConfig: {},
     envs: ['es6'],
     parser: 'babel-eslint',
     parserOptions: {
       ecmaVersion: 2017,
       sourceType: 'module',
       ecmaFeatures: {
         objectLiteralDuplicateProperties: false,
         generators: true,
         impliedStrict: true
       }
     },
     settings: {},
     globals: ['process'],
    rules: {}
  }
});
```

- `test`: Test which files should be linted.
- `include`: An array of paths to include in linting. Maps to Webpack's
[`Rule.include`](https://webpack.js.org/configuration/module/#rule-include)
- `exclude`: An array of paths to exclude from linting. Maps to Webpack's
[`Rule.exclude`](https://webpack.js.org/configuration/module/#rule-exclude)
- `eslint`: An ESLint CLIEngine configuration object for configuring ESLint. Use this to configure rules,
plugins, and other [ESLint options](http://eslint.org/docs/user-guide/configuring).

## Customization

`neutrino-middleware-eslint` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `lint`: By default, lints JS and JSX files from included directories using ESLint. Contains a single loader named
`eslint`.

## Information

This middleware will show errors and warnings in the console during development, and will cause a failure when
creating a build bundle.

---

If you want your preset or middleware to also extend from another **ESLint configuration or preset** that you have made
a dependency, you must use `baseConfig.extends` rather than just `extends`. This is a limitation of ESLint, not this
middleware.

---

This middleware only configures a target environment for `es6`, leaving other build middleware free to add their own
target environments. If your middleware puts restrictions on which environments it is capable of running, please
document that clearly in your middleware.

## eslintrc Config

`neutrino-middleware-eslint` also provides a method for getting the ESLint configuration suitable for use in an eslintrc
file. Typically this is used for providing hints or fix solutions to the development environment, e.g. IDEs and text
editors. Doing this requires [creating an instance of the Neutrino API](../../api/README.md) and providing the presets uses.
If you keep this information in `neutrino.use` in package.json, this should be relatively straightforward. By
providing all the presets used to Neutrino, you can ensure all the linting options used across all presets will be
merged together for your development environment, without the need for copying, duplication, or loss of organization and
separation.

_Example: Create a .eslintrc.js file in the root of the project._

```js
// .eslintrc.js
const { Neutrino } = require('neutrino');
const pkg = require('./package.json');
const api = Neutrino();

pkg.neutrino.use
  .map(require)
  .map(api.use);

module.exports = api.eslintrc();
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](../../contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-eslint.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-eslint.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-eslint
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
