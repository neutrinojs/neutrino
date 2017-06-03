# Neutrino Airbnb Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url] 

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
- Neutrino v5, Neutrino build preset

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

`neutrino-preset-airbnb-base` follows the standard [project layout](../../project-layout.md) specified by Neutrino. This
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

Or if you have set up Neutrino with `neutrino.use` in your package.json:

```json
{
  "neutrino": {
    "use": [
      "neutrino-preset-airbnb-base",
      "neutrino-preset-web"
    ]
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

error Command failed with exit code 1.
```

## Customizing

To override the build configuration, start with the documentation on [customization](../../customization/README.md).
`neutrino-preset-airbnb-base` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `lint`: Lints JS and JSX files from the `src` directory using ESLint. Contains a single loader named `eslint`. This is
inherited from `neutrino-middleware-eslint`.

### Simple customization

By following the [customization guide](../../customization/simple.md) and knowing the rule and loader IDs above,
you can override and augment the linting configuration directly from package.json. _Note: Using the simple customization
approach for linting changes can be quite verbose. Consider using advanced configuration below if this bothers you._

_Example: Turn off semicolons from being required as defined by the Airbnb rules._

```json
{
  "neutrino": {
    "config": {
      "module": {
        "rule": {
          "lint": {
            "use": {
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

By following the [customization guide](../../customization/advanced.md) and knowing the rule and loader IDs above,
you can override and augment the build by creating a JS module which overrides the config. This preset is also
Neutrino middleware, making it easy to compose and extend the configuration.

_Example: Turn off semicolons from being required as defined by the Airbnb rules._

```js
// If using as middleware, remove from middleware and .use it from your override:
const airbnb = require('neutrino-preset-airbnb-base');

module.exports = neutrino => {
  neutrino.use(airbnb, {
    eslint: {
      rules: {
        semi: 'off'
      }
    }
  });
};
```

```js
// If using as a preset from the CLI or configured in package.json,
// override its configuration directly:
const merge = require('deepmerge');

module.exports = neutrino => {
  neutrino.config.module
    .rule('lint')
      .use('eslint')
        .tap(options => merge(options, {
          rules: {
            semi: 'off'
          }
        }));
};
```

## eslintrc Config

`neutrino-lint-airbnb-base` also provides a method for getting the ESLint configuration suitable for use in an eslintrc
file. Typically this is used for providing hints or fix solutions to the development environment, e.g. IDEs and text
editors. Doing this requires [creating an instance of the Neutrino API](../../api/README.md) and providing the presets uses.
If you keep this information in `neutrino.use` in package.json, this should be relatively straightforward. By
providing all the presets used to Neutrino, you can ensure all the linting options used across all those preset will be
merged together for your development environment, without the need for copying, duplication, or loss of organization and
separation. This is inherited from `neutrino-middleware-eslint`.

_Example: Create a .eslintrc.js file in the root of the project._

```js
// .eslintrc.js
const { Neutrino } = require('neutrino');
const pkg = require('./package.json');
const api = Neutrino();

// If the Airbnb preset is not included in pkg.neutrino.use,
// use it manually:
api.use(require('neutrino-preset-airbnb-base'));

// Add the rest of the presets:
pkg.neutrino.use
  .map(require)
  .map(api.use);

module.exports = api.eslintrc();
```

Projects may face a problem when their editor or IDE lints all files and highlights errors that were normally excluded from source, i.e. Neutrino's `include` and `exclude` options. This is because the ESLint CLI does not have a way to specify included and excluded files from configuration. If you still wish to use ESLint's CLI for linting, consider setting [CLI flags](http://eslint.org/docs/user-guide/command-line-interface#options) or using an [eslintignore](http://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) to choose which files to include or exclude from linting.

Unfortunately ESlint doesn't provide possibility to configure ignored paths from Neutrino configuration to exclude them from linting. Projects authors should define this manually in their project root directory in `.eslintignore` file.

*.eslintignore:*

```
/build
/*.*
```

This paths exactly will exclude built files and any files in the root directory (e.g. custom Neutrino configuration) but `src` and `test` folders will be still checked. `/node_modules` are ignored by default in ESLint. More information can be found in the [ESLint user guide](http://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories)

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](../../contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-airbnb-base.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-airbnb-base.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-airbnb-base
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
