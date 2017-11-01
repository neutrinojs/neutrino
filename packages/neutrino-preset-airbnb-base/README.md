# Neutrino Airbnb Base Preset

`neutrino-preset-airbnb-base` is a Neutrino preset that supports linting JavaScript projects with Airbnb's base ESLint
config, following the [Airbnb styleguide](https://github.com/airbnb/javascript).

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url] 

## Features

- Zero upfront configuration necessary to start linting your project
- Modern Babel knowledge supporting ES modules, JSX (when used with React preset), Web and Node.js apps
- Highly visible during development, fails compilation when building for production
- Easily extensible to customize your project as needed

_Note: If you are building a React project, you should probably use 
[`neutrino-preset-airbnb`](https://www.npmjs.com/package/neutrino-preset-airbnb) instead._

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7, Neutrino build preset

## Installation

`neutrino-preset-airbnb-base` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-airbnb-base` are development dependencies. You will also be using
another Neutrino preset for building your application source code.

#### Yarn

```bash
❯ yarn add --dev neutrino-preset-airbnb-base
```

#### npm

```bash
❯ npm install --save-dev neutrino-preset-airbnb-base
```

## Project Layout

`neutrino-preset-airbnb-base` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project.

## Quickstart

After adding the Airbnb preset to your Neutrino-built project, edit your project's package.json to add the preset for
linting **before** your build preset. For example, if you are building your project using `neutrino-preset-web`:

```json
{
  "scripts": {
    "start": "neutrino start --use neutrino-preset-airbnb-base neutrino-preset-web",
    "build": "neutrino build --use neutrino-preset-airbnb-base neutrino-preset-web"
  }
}
```

Or if you are using a `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: [
    'neutrino-preset-airbnb-base',
    'neutrino-preset-web'
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

`neutrino-preset-airbnb-base` will cause errors to **fail your build** when creating a bundle via `neutrino build`. If
you want to ease introduction of this linting preset to your project, consider only adding it to your use list for
`neutrino start` or `development` environment until all linting errors have been resolved.

```bash
❯ yarn build

clean-webpack-plugin: /web/build has been removed.
Build completed in 1.287s

./src/index.js

/Users/eli/code/neutrino-examples/web/src/index.js
  6:1   warning  Unexpected console statement            no-console
  6:14  error    A space is required after '{'           babel/object-curly-spacing
  6:16  error    Missing space before value for key 'a'  key-spacing
  6:17  error    A space is required before '}'          babel/object-curly-spacing

✖ 4 problems (3 errors, 1 warning)

error Command failed with exit code 1.
```

_Example: ease linting into project by only adding when `NODE_ENV=development`, e.g. `neutrino start`:_

```js
module.exports = {
  use: [
    'neutrino-preset-web'
  ],
  env: {
    NODE_ENV: {
      development: {
        use: ['neutrino-preset-airbnb-base']
      }
    }
  }
};
```

## Middleware options

This preset uses the same middleware options as [neutrino-middleware-eslint](https://neutrino.js.org/middleware/neutrino-middleware-eslint).
If you wish to customize what is included, excluded, or any ESLint options, you can provide an options object with the
middleware and this will be merged with our internal defaults for this preset. Use an array pair instead of a string
to supply these options.

_Example: Turn off semicolons from being required as defined by the Airbnb rules._

```js
module.exports = {
  use: [
    ['neutrino-preset-airbnb-base', {
      eslint: {
        rules: {
          semi: 'off'
        }
      }
    }]
  ]
};
```

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-airbnb-base` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `lint` | Lints JS and JSX files from the `src` directory using ESLint. Contains a single loader named `eslint`. This is inherited from `neutrino-middleware-eslint`. | all |

### Information

If you want your preset or middleware to also extend from another **ESLint configuration or preset** that you have made
a dependency, you must use `baseConfig.extends` rather than just `extends`. This is a limitation of ESLint, not this
middleware.

### Override configuration

By following the [customization guide](https://neutrino.js.org/customization) and knowing the rule and loader IDs above,
you can also override or augment the build by providing a function to your `.neutrinorc.js` use array. You can also
make this change from the Neutrino API when using the `use` method.

_Example: Turn off semicolons from being required as defined by the Airbnb rules from `.neutrinorc.js` using a function and the API:_

```js
module.exports = {
  use: [
    'neutrino-preset-airbnb-base',
    (neutrino) => neutrino.config.module
      .rule('lint')
      .use('eslint')
      .tap(options => Object.assign({}, options, {
        rules: {
          semi: 'off'
        }
      }))
  ]
};
```

## eslint CLI

_This is the recommended way to perform a one-off lint in a Neutrino project, and is inherited from neutrino-middleware-eslint._

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

`neutrino-middleware-eslint`, from which this preset inherits, also provides a method for getting the ESLint
configuration suitable for use in an eslintrc file. Typically this is used for providing hints or fix solutions to the
development environment, e.g. IDEs and text editors. Doing this requires
[creating an instance of the Neutrino API](https://neutrino.js.org/api) and providing the middleware it uses. If you keep all
this information in a `.neutrinorc.js`, this should be relatively straightforward. By providing all the middleware used
to Neutrino, you can ensure all the linting options used across all middleware will be merged together for your
development environment, without the need for copying, duplication, or loss of organization and separation.

This middleware registers another command named `eslintrc` which returns an ESLint configuration object suitable for
consumption by the ESLint CLI. Use the Neutrino API's `call` method to invoke this command:

_Example: Create a .eslintrc.js file in the root of the project, using `.neutrinorc.js` middleware._

```js
// .eslintrc.js

// If you do not specify any middleware to call(),
// it will use the local .neutrinorc.js file

const { Neutrino } = require('neutrino');

module.exports = Neutrino().call('eslintrc');
```

_Example: Create a .eslintrc.js file in the root of the project, using specified middleware._

```js
// .eslintrc.js
const { Neutrino } = require('neutrino');

module.exports = Neutrino().call('eslintrc', [
  ['neutrino-preset-airbnb-base', {
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

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-airbnb-base.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-airbnb-base.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-airbnb-base
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
