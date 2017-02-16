# Neutrino Airbnb Preset [![NPM version][npm-image]][npm-url]

`neutrino-preset-airbnb-base` is a Neutrino preset that supports linting JavaScript projects with Airbnb's base ESLint
config, following the [Airbnb styleguide](https://github.com/airbnb/javascript).

## Features

- Zero upfront configuration necessary to start linting your project
- Modern Babel knowledge supporting ES modules, JSX (when used with React preset), Web and Node.js apps
- Highly visible during development, fails compilation when building for production
- Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v4, Neutrino build preset

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

`neutrino-preset-airbnb-base` follows the standard [project layout](/project-layout.md) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project.

## Quickstart

After adding the Airbnb preset to your Neutrino-built project, edit your project's package.json to add the preset for
linting **before** your build preset. For example, if you are building your project using `neutrino-preset-web`:

```json
{
  "scripts": {
    "start": "neutrino start --presets neutrino-preset-airbnb-base neutrino-preset-web",
    "build": "neutrino build --presets neutrino-preset-airbnb-base neutrino-preset-web"
  }
}
```

Start the app, then check your console for any linting errors. If everything is successful, you should see no errors in
the console. ESLint errors visible during development are reported, but will still continue to build and serve your
project.

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
you want to ease introduction of this linting preset to your project, consider only adding it to your preset list for
`neutrino start` until all linting errors have been resolved.

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

 @ multi ./src/index.js
./src/index.js
Module build failed: Error: Module failed because of a eslint error.

    at lint (/Users/eli/code/neutrino-dev/packages/neutrino-preset-airbnb-base/node_modules/eslint-loader/index.js:115:17)
    at Object.module.exports (/Users/eli/code/neutrino-dev/packages/neutrino-preset-airbnb-base/node_modules/eslint-loader/index.js:181:3)
 @ multi ./src/index.js
error Command failed with exit code 1.
```

## Customizing

To override the build configuration, start with the documentation on [customization](/customization/README.md).
`neutrino-preset-airbnb-base` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `lint`: Lints JS and JSX files from the `src` directory using ESLint. Contains a single loader named `eslint`.

### Simple customization

By following the [customization guide](/customization/simple.md) and knowing the rule and loader IDs above,
you can override and augment the linting configuration directly from package.json. _Note: Using the simple customization
approach for linting changes can be verbose._

_Example: Turn off semicolons from being required as defined by the Airbnb rules._

```json
{
  "config": {
    "neutrino": {
      "module": {
        "rule": {
          "lint": {
            "loader": {
              "eslint": {
                "options": {
                  "rules": {
                    "semi": "off"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

Again, using simple customization for linting can be verbose. Consider using advanced customization if it suits your
project.

### Advanced configuration

By following the [customization guide](/customization/advanced.md) and knowing the rule and loader IDs above,
you can override and augment the build by creating a JS module which overrides the config.

_Example: Turn off semicolons from being required as defined by the Airbnb rules._

```js
const merge = require('deepmerge');

module.exports = neutrino => {
  neutrino.config
    .rule('lint')
    .loader('eslint', ({ options }) => {
      return {
        options: merge(options, {
          rules: {
            semi: 'off'
          }
        })
      };
    });
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](/contributing/README.md) for details.

[npm-image]: https://badge.fury.io/js/neutrino-preset-airbnb-base.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-airbnb-base
