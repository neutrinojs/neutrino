# Neutrino ESLint Middleware

`@neutrinojs/eslint` is Neutrino middleware for linting source code using ESLint and eslint-loader.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/eslint` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/eslint
```

#### npm

```bash
❯ npm install --save @neutrinojs/eslint
```

## Usage

`@neutrinojs/eslint` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const eslint = require('@neutrinojs/eslint');

// Usage shows default values
neutrino.use(eslint, {
  test: /\.(js|jsx)$/,
  include: [], /* Should specify either include or exclude */
  exclude: [], /* Should specify either include or exclude */
  eslint: {
    cwd: neutrino.options.root,
    useEslintrc: false,
    root: true,
    extensions: neutrino.options.extensions,
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
- `include`: An array of paths to include in linting. Maps to webpack's [`Rule.include`](https://webpack.js.org/configuration/module/#rule-include)
- `exclude`: An array of paths to exclude from linting. Maps to webpack's [`Rule.exclude`](https://webpack.js.org/configuration/module/#rule-exclude)
- `eslint`: An ESLint CLIEngine configuration object for configuring ESLint. Use this to configure rules, plugins, and other [ESLint options](http://eslint.org/docs/user-guide/configuring).

## Customization

`@neutrinojs/eslint` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `lint` | By default, lints JS and JSX files from included directories using ESLint. Contains a single loader named `eslint`. | all |

## Information

By default this middleware will show errors and warnings in the console during development, and will cause a failure when
creating a build bundle.

---

If you want your preset or middleware to also extend from another **ESLint configuration or preset** that you have made
a dependency, you must use `baseConfig.extends` rather than just `extends`. This is a limitation of ESLint, not this
middleware.

---

This middleware only configures a target environment for `es6`, leaving other build middleware free to add their own
target environments. If your middleware puts restrictions on which environments it is capable of running, please
document that clearly in your middleware.

## eslint CLI

_This is the recommended way to perform a one-off lint in a Neutrino project._

You can also have Neutrino invoke ESLint for you if you wish to perform a one-time lint. This avoids needing to install
ESLint manually, creating a `.eslintrc.js` file, or having to manage includes and ignores. As long as the ESLint
middleware is loaded, you have access to a command to run ESLint from the command line.

This middleware registers a command named `lint` which programmatically calls ESLint and prints the results to
the console.

```bash
❯ neutrino lint
```

```bash
❯ neutrino lint --fix
```

## eslintrc Config

If you cannot or do not wish to use Neutrino to execute one-off linting, you can still use ESLint manually.

`@neutrinojs/eslint` also provides a method for getting the ESLint configuration suitable for use in an eslintrc
file. Typically this is used for providing hints or fix solutions to the development environment, e.g. IDEs and text
editors. Doing this requires [creating an instance of the Neutrino API](https://neutrino.js.org/api) and providing the
middleware it uses. If you keep all this information in a `.neutrinorc.js`, this should be relatively straightforward. By
providing all the middleware used to Neutrino, you can ensure all the linting options used across all middleware will be
merged together for your development environment, without the need for copying, duplication, or loss of organization and
separation.

This middleware registers another command named `eslintrc` which returns an ESLint configuration object suitable for
consumption by the ESLint CLI. Use the Neutrino API's `call` method to invoke this command:

_Example: Create a .eslintrc.js file in the root of the project, using `.neutrinorc.js` middleware._

```js
// .eslintrc.js
const { Neutrino } = require('neutrino');

// Specify middleware to Neutrino prior to calling eslintrc.
// Even if using .neutrinorc.js, you must specify it when using
// the API
module.exports = Neutrino()
  .use('.neutrinorc.js')
  .call('eslintrc');
```

_Example: Create a .eslintrc.js file in the root of the project, using specified middleware._

```js
// .eslintrc.js
const { Neutrino } = require('neutrino');

module.exports = Neutrino()
  .use('@neutrinojs/eslint', {
    eslint: {
      rules: { semi: 'off' }
    }
  })
  .call('eslintrc');
```

If you are able, only use a `.eslintrc.js` file for editor hints, and use the Neutrino `lint` command for one-off linting
or fixes. **Loading ESLint configuration from `.eslintrc.js` that is not `.neutrinorc.js` or uses configuration that
differs from `.neutrinorc.js` could lead to unintended consequences such as linting not failing or passing when expected,
or working differently when running different commands. Closely evaluate whether you _actually_ need to make these rule
changes in `.eslintrc.js` over `.neutrinorc.js`.**

Projects may face a problem when their editor or IDE lints all files and highlights errors that were normally excluded
from source, i.e. Neutrino's `include` and `exclude` options. This is because the ESLint CLI does not have a way to
specify included and excluded files from configuration. If you still wish to use ESLint's CLI for linting, consider
setting [CLI flags](http://eslint.org/docs/user-guide/command-line-interface#options) or using an
[eslintignore](http://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) to choose which files to
include or exclude from linting.

Unfortunately ESLint does not provide the possibility to configure ignored paths from Neutrino configuration and exclude them
from linting. Projects authors should define this manually in their project root directory in a `.eslintignore` file. This
is one of the main reasons to prefer using the `lint` CLI command with this middleware, as it avoids a lot of manual
configuration and boilerplate.

`.eslintignore` file:

```
/build
/*.*
```

ESLint will exclude built files and any files in the root directory (e.g. custom Neutrino configuration) but `src` and
`test` folders will be still checked. `node_modules` are ignored by default in ESLint. More information can be found
in the [ESLint user guide](http://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories).

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/eslint.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/eslint.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/eslint
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
