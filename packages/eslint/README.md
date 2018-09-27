# Neutrino ESLint Middleware

`@neutrinojs/eslint` is Neutrino middleware for linting source code using ESLint and eslint-loader.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9 and one of the Neutrino build presets
- webpack 4
- ESLint 5

## Installation

`@neutrinojs/eslint` can be installed via the Yarn or npm clients. Inside your project, make sure
`@neutrinojs/eslint` and `eslint` are development dependencies. You will also be using
another Neutrino preset for building your application source code.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/eslint eslint
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/eslint eslint
```

## Usage

`@neutrinojs/eslint` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const eslint = require('@neutrinojs/eslint');

// Usage shows default values
neutrino.use(eslint, {
  test: neutrino.regexFromExtensions(), // Uses extensions from neutrino.options.extensions
  include: [neutrino.options.source, neutrino.options.tests],
  exclude: [],
  eslint: {
    cache: true,
    failOnError: process.env.NODE_ENV !== 'development',
    cwd: neutrino.options.root,
    useEslintrc: false,
    root: true,
    // Can be the name of a built-in ESLint formatter or the module/path of an external one.
    formatter: 'codeframe',
    plugins: ['babel'],
    baseConfig: {},
    envs: ['es6'],
    parser: 'babel-eslint',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module'
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
- `eslint`: An ESLint CLIEngine configuration object for configuring ESLint. Use this to configure rules, plugins, and other [ESLint options](https://eslint.org/docs/user-guide/configuring).

## Customization

`@neutrinojs/eslint` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | NODE_ENV |
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

## eslintrc Config

`@neutrinojs/eslint`, provides an `.eslintrc()` output handler for
generating the ESLint configuration in a format suitable for use in an `.eslintrc.js` file. This
allows the ESLint CLI to be used outside of building the project, and for IDEs and text editors to
provide linting hints/fixes.

Create a `.eslintrc.js` file in the root of the project, containing:

```js
// .eslintrc.js
const neutrino = require('neutrino');

module.exports = neutrino().eslintrc();
```

This `.eslintrc.js` configuration will be automatically used when running the ESLint CLI.
For convenience a `lint` script alias can be added to your `package.json`, allowing linting
to be run via `yarn lint` or `npm run lint`:

```json
{
  "scripts": {
    "lint": "eslint --cache --format codeframe --ext mjs,jsx,js src"
  }
}
```

Projects may face a problem when their editor or IDE lints all files and highlights errors that were normally excluded
from source, i.e. Neutrino's `include` and `exclude` options. This is because the ESLint CLI does not have a way to
specify included and excluded files from the `.eslintrc.js` configuration. Instead you will need to create an
[.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file that controls
which files should be excluded from linting.

## Contributing

This middleware is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/eslint.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/eslint.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/eslint
