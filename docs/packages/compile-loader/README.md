# Neutrino Compile Loader Middleware

`@neutrinojs/compile-loader` is Neutrino middleware for compiling source code with Babel.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/compile-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/compile-loader
```

#### npm

```bash
❯ npm install --save @neutrinojs/compile-loader
```

## Usage

`@neutrinojs/compile-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format

const compile = require('@neutrinojs/compile-loader');

neutrino.use(compile, {
  include: [],
  exclude: [],
  babel: {},
  ruleId: 'compile',
  useId: 'babel'
});
```

```js
// Using object or array middleware format

module.exports = {
  use: [
    ['@neutrinojs/compile-loader', {
      include: [],
      exclude: [],
      babel: {},
      ruleId: 'compile',
      useId: 'babel'
    }]
  ]
};
```

- `include` should be an array of paths to include in the compilation. Maps to webpack's
[`Rule.include`](https://webpack.js.org/configuration/module/#rule-include)
- `exclude` should be an array of paths to exclude from the compilation. Maps to webpack's
[`Rule.exclude`](https://webpack.js.org/configuration/module/#rule-exclude)
- `babel` is a [Babel configuration object](https://babeljs.io/docs/usage/api/#options), consumed by babel-loader. Use
this to set properties such as `presets`, `plugins`, and `env`.
- `ruleId` is the identifier to the compiler loader rule. Override this to add an additional compile-loader instance
- `useId` is the identifier for the babel loader. Override this to change the identifier.

## Merging Babel Configuration

This package also exposes a function for merging Babel configurations. This comes from
the [babel-merge](https://www.npmjs.com/package/babel-merge) package.

```js
const { merge } = require('@neutrinojs/compile-loader');

const together = merge(
  {
    presets: [
      ['babel-preset-env', {
        targets: {
          browsers: ['latest 1 Chrome']
        }
      }]
    ]
  },
  {
    presets: [
      ['babel-preset-env', {
        targets: {
          browsers: ['latest 1 Firefox']
        }
      }]
    ]
  }
);

console.log(together);

// Logs:
{
  presets: [
    ['babel-preset-env', {
      targets: {
        browsers: [
          'latest 1 Chrome',
          'latest 1 Firefox'
        ]
      }
    }]
  ]
}
```

### Advanced merging

Should you need to do merging of Babel configuration that is more advanced than this, such as re-ordering the options,
you will need to `tap` into the existing Babel options to do so. This still involves using the compile-loader's
`merge` function.

_Example: enable current decorator syntax in the compile loader:_

```js
const { merge } = require('@neutrinojs/compile-loader');

// Decorators generally need to be enabled *before* other
// syntax which exists in both normal plugins, and
// development environment plugins.
// Tap into the existing Babel options and merge our
// decorator options *before* the rest of the existing
// Babel options
config.module
  .rule('compile')
    .use('babel')
      .tap(options => merge({
        plugins: [
          require.resolve('babel-plugin-transform-decorators-legacy'),
          require.resolve('babel-plugin-transform-class-properties')
        ]
      }, options));
```

## Customization

`@neutrinojs/compile-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `compile` | Compiles JS and JSX files from the `src` directory using Babel. Contains a single loader named `babel`. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/compile-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/compile-loader.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/compile-loader
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
