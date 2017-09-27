# Neutrino ESLint Middleware
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-middleware-eslint` is Neutrino middleware for linting source code using ESLint and eslint-loader.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6

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
// Using function middleware format
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
    extensions: ['js', 'jsx'],
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
- `include`: An array of paths to include in linting. Maps to Webpack's [`Rule.include`](https://webpack.js.org/configuration/module/#rule-include)
- `exclude`: An array of paths to exclude from linting. Maps to Webpack's [`Rule.exclude`](https://webpack.js.org/configuration/module/#rule-exclude)
- `eslint`: An ESLint CLIEngine configuration object for configuring ESLint. Use this to configure rules, plugins, and other [ESLint options](http://eslint.org/docs/user-guide/configuring).

## Customization

`neutrino-middleware-eslint` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
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

`neutrino-middleware-eslint` also provides a method for getting the ESLint configuration suitable for use in an eslintrc
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

// If you do not specify any middleware to call(),
// it will use the local .neutrinorc.js file

const { Neutrino } = require('neutrino');
const api = Neutrino();

module.exports = api.call('eslintrc');
```

_Example: Create a .eslintrc.js file in the root of the project, using specified middleware._

```js
// .eslintrc.js
const { Neutrino } = require('neutrino');
const api = Neutrino();

module.exports = api.call('eslintrc', [
  ['neutrino-middleware-eslint', {
    eslint: {
      rules: { semi: 'off' }
    }
  }],
  'neutrino-preset-react'
]);
```

If you are able, only use a `.eslintrc.js` file for editor hints, and use the Neutrino `lint` command for one-off linting
or fixes.

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

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-eslint.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-middleware-eslint.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-eslint
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
