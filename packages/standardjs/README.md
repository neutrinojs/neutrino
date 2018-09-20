# Neutrino StandardJS Preset

`@neutrinojs/standardjs` is a Neutrino preset that supports linting JavaScript projects with the
[StandardJS ESLint config](https://standardjs.com).

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Features

- Zero upfront configuration necessary to start linting your project with StandardJS
- Modern Babel knowledge supporting ES modules, Web and Node.js apps
- Highly visible during development, fails compilation when building for production
- Easily extensible to customize your project as needed

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9 and one of the Neutrino build presets
- webpack 4
- ESLint 5

## Installation

`@neutrinojs/standardjs` can be installed via the Yarn or npm clients. Inside your project, make sure
`@neutrinojs/standardjs` and `eslint` are development dependencies. You will also be using
another Neutrino preset for building your application source code.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/standardjs eslint
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/standardjs eslint
```

## Project Layout

`@neutrinojs/standardjs` follows the standard [project layout](https://neutrinojs.org/project-layout/) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project.

## Quickstart

After adding the StandardJS preset to your Neutrino-built project, edit your project's `.neutrinorc.js` to add the preset for
linting **before** your build preset. For example, when building your project using `@neutrinojs/web`:

```js
module.exports = {
  options: {
    root: __dirname
  },
  use: [
    '@neutrinojs/standardjs',
    '@neutrinojs/web'
  ]
};
```

Start the app, then check your console for any linting errors. If everything is successful, you should see no errors in
the console. ESLint errors visible during development are reported, but will still continue to build and serve your
project. ESLint errors during build will not build the project, and will cause the command to fail.

#### Yarn

```bash
❯ yarn start

✔ Development server running on: http://localhost:5000
✔ Build completed

ERROR in ./src/index.js

/web/src/index.js
  7:1   warning  Unexpected console statement                no-console
  7:14  error    A space is required after '{'               babel/object-curly-spacing
  7:20  error    Missing space before value for key 'hello'  key-spacing
  7:27  error    A space is required before '}'              babel/object-curly-spacing

✖ 4 problems (3 errors, 1 warning)
```

#### npm

```bash
❯ npm start

✔ Development server running on: http://localhost:5000
✔ Build completed

ERROR in ./src/index.js

/web/src/index.js
  7:1   warning  Unexpected console statement                no-console
  7:14  error    A space is required after '{'               babel/object-curly-spacing
  7:20  error    Missing space before value for key 'hello'  key-spacing
  7:27  error    A space is required before '}'              babel/object-curly-spacing

✖ 4 problems (3 errors, 1 warning)
```

## Building

`@neutrinojs/standardjs` will cause errors to **fail your build** when `NODE_ENV` is not `'development'`.
If you want to ease introduction of this linting preset to your project, consider only adding it to
your `use` list during development until all linting errors have been resolved.

```bash
❯ yarn build


/web/src/index.js
  6:1   warning  Unexpected console statement            no-console
  6:14  error    A space is required after '{'           babel/object-curly-spacing
  6:16  error    Missing space before value for key 'a'  key-spacing
  6:17  error    A space is required before '}'          babel/object-curly-spacing

✖ 4 problems (3 errors, 1 warning)

error Command failed with exit code 1.
```

_Example: ease linting into project by only enabling when `NODE_ENV=development` (ie: `--mode development`):_

```js
module.exports = {
  options: {
    root: __dirname
  },
  use: [
    process.env.NODE_ENV === 'development' ? '@neutrinojs/standardjs' : false,
    '@neutrinojs/web'
  ]
};
```

## Middleware options

This preset uses the same middleware options as [@neutrinojs/eslint](https://neutrinojs.org/packages/eslint/).
If you wish to customize what is included, excluded, or any ESLint options, you can provide an options object with the
middleware and this will be merged with our internal defaults for this preset. Use an array pair instead of a string
to supply these options.

_Example: Turn on semicolons as being required, as opposed to the StandardJS rules._

```js
module.exports = {
  options: {
    root: __dirname
  },
  use: [
    ['@neutrinojs/standardjs', {
      eslint: {
        rules: {
          'babel/semi': 'off'
        }
      }
    }]
  ]
};
```

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrinojs.org/customization/).
`@neutrinojs/standardjs` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | NODE_ENV |
| --- | --- | --- |
| `lint` | Lints JS and JSX files from the `src` directory using ESLint. Contains a single loader named `eslint`. This is inherited from `@neutrinojs/eslint`. | all |

### Information

If you want your preset or middleware to also extend from another **ESLint configuration or preset** that you have made
a dependency, you must use `baseConfig.extends` rather than just `extends`. This is a limitation of ESLint, not this
middleware.

### Override configuration

By following the [customization guide](https://neutrinojs.org/customization/) and knowing the rule and loader IDs above,
you can also override or augment the build by providing a function to your `.neutrinorc.js` use array. You can also
make this change from the Neutrino API when using the `use` method.

_Example: Turn on semicolons as being required, as opposed to the StandardJS rules, from `.neutrinorc.js` using a function and the API:_

```js
module.exports = {
  options: {
    root: __dirname
  },
  use: [
    '@neutrinojs/standardjs',
    (neutrino) => neutrino.config.module
      .rule('lint')
      .use('eslint')
      .tap(options => ({
        ...options,
        rules: {
          'babel/semi': 'off'
        }
      }))
  ]
};
```

## eslintrc Config

`@neutrinojs/eslint`, from which this preset inherits, provides an `.eslintrc()` output handler for
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
    "lint": "eslint --cache --ext mjs,jsx,js src"
  }
}
```

Projects may face a problem when their editor or IDE lints all files and highlights errors that were normally excluded
from source, i.e. Neutrino's `include` and `exclude` options. This is because the ESLint CLI does not have a way to
specify included and excluded files from the `.eslintrc.js` configuration. Instead you will need to create an
[.eslintignore](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file that controls
which files should be excluded from linting.

## Contributing

This preset is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/standardjs.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/standardjs.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/standardjs
