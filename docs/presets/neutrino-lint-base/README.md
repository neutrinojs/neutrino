# Neutrino Lint Base
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-lint-base` is an abstract Neutrino preset base that makes creating ESLint-based presets simpler. By creating
a linting preset that extends from `neutrino-lint-base`, the development overhead and dependencies needed can be
significantly reduced. Use it as a baseline to create your own linting presets easier and more quickly.

## Features

- Quickly and easily create your own Neutrino linting presets
- Modern Babel knowledge supporting ES modules, JSX (when used with React preset), Web and Node.js apps
- Highly visible during development, fails compilation when building for production
- Easily extensible to customize your project as needed

## Development Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v4

## Installation

`neutrino-lint-base` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add neutrino-lint-base
```

#### npm

```bash
❯ npm install --save neutrino-lint-base
```

Your project should also install any dependencies needed to operate based on options passed to `eslint-loader` or
ESLint's CLIEngine.

## Project Layout

`neutrino-lint-base` follows the standard [project layout](/project-layout.md) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. The `.js` or `.jsx` files in this directory are the ones that will be linted by your preset.

## Creating the preset

Your preset will follow the same guidelines for normally creating Neutrino presets, with your preset extending
`neutrino-lint-base`. This starts out by having your package module export a function which accepts a Neutrino instance:

```js
module.exports = neutrino => {
  // ...
};
```

The next step is to `require`, or `import` if your package supports it, `neutrino-lint-base` and execute it with
Neutrino. This will add the lint base's configuration to Neutrino for your preset to extend further:

```js
const lint = require('neutrino-lint-base');

module.exports = neutrino => {
  lint(neutrino);
  // ...
};
```

Now comes the core of your own preset. By extending from `neutrino-lint-base`'s "lint" rule and "eslint" loader, you
can manipulate the options as you desire. Consider using a package such as
[`deepmerge`](https://www.npmjs.com/package/deepmerge) to make extending these options easier:

_Example: Create a preset that shuts off semicolons from being required by ESLint._

```js
const lint = require('neutrino-lint-base');
const merge = require('deepmerge');

module.exports = neutrino => {
  lint(neutrino);
  neutrino.config
    .rule('lint')
    .loader('eslint', props => merge(props, {
      options: {
        rules: {
          semi: 'off'
        }
      }
    }));
};
```

_Example: Create a preset that lints a project using the Airbnb base ESLint rules._

```js
const lint = require('neutrino-lint-base');
const merge = require('deepmerge');

module.exports = neutrino => {
  lint(neutrino);
  neutrino.config
    .rule('lint')
    .loader('eslint', props => merge(props, {
      options: {
        baseConfig: {
          extends: ['airbnb-base']
        }
      }
    }));
};
```

Visit the [creating presets](/creating-presets.md) documentation for more detailed information on creating your own
custom preset.

## Customization

`neutrino-lint-base` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `lint`: Lints JS and JSX files from the `src` directory using ESLint. Contains a single loader named `eslint`.

## Information

The lint base will show errors and warnings in the console during development, and will cause a failure when
creating a build bundle.

---

If you want your preset to also extend from another ESLint configuration that you have made a dependency, you must use
`baseConfig.extends` rather than just `extends`. This is a limitation of ESLint, not this lint base.

```js
const lint = require('neutrino-lint-base');
const merge = require('deepmerge');

module.exports = neutrino => {
  lint(neutrino);
  neutrino.config
    .rule('lint')
    .loader('eslint', props => merge(props, {
      options: {
        baseConfig: {
          extends: [
            'YOUR_ESLINT_CONFIGURATION_BASE_A',
            'YOUR_ESLINT_CONFIGURATION_BASE_B'
          ]
        }
      }
    }));
};
```

---

The linting base only configures a target environment for `es6`, leaving other build presets free to add their own
target environments. If your preset puts restrictions on which environments it is capable of running, please document
that clearly in your preset.

For specifics on what options are configured when using this linting base, please
[view the source](https://github.com/mozilla-neutrino/neutrino-dev/blob/master/packages/neutrino-lint-base/src/index.js).

---

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](/contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-lint-base.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-lint-base.svg
[npm-url]: https://npmjs.org/package/neutrino-lint-base
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
