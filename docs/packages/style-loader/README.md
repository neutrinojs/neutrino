# Neutrino Style Loader Middleware

`@neutrinojs/style-loader` is Neutrino middleware for loading and importing stylesheets from modules.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Features

- Zero upfront configuration necessary to import stylesheets into modules
- Automatic stylesheet extraction; importing stylesheets into modules creates bundled external stylesheets
- Pre-configured to support CSS Modules via `*.module.css` file extensions
- CSS Hot Module Replacement support
- Very extensible to customize as needed

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7

## Installation

`@neutrinojs/style-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/style-loader
```

#### npm

```bash
❯ npm install --save @neutrinojs/style-loader
```

## Usage

`@neutrinojs/style-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const styles = require('@neutrinojs/style-loader');

// Use with default options
neutrino.use(styles);

// Usage showing default options
neutrino.use(styles, {
  style: {},
  css: {},
  test: /\.css$/,
  ruleId: 'style',
  styleUseId: 'style',
  cssUseId: 'css',
  hotUseId: 'hot',
  hot: true,
  modules: true,
  modulesSuffix: '-modules',
  modulesTest: /\.module.css$/,
  extractId: 'extract',
  extract: {
    plugin: {},
    loader: {}
  }
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/style-loader']
};

// Usage showing default options
module.exports = {
  use: [
    ['@neutrinojs/style-loader', {
      style: {},
      css: {},
      test: /\.css$/,
      ruleId: 'style',
      styleUseId: 'style',
      cssUseId: 'css',
      hotUseId: 'hot',
      hot: true,
      modules: true,
      modulesSuffix: '-modules',
      modulesTest: /\.module.css$/,
      extractId: 'extract',
      extract: {
        plugin: {},
        loader: {}
      }
    }]
  ]
};
```

- `style`: Set options for the style-loader used when loading CSS files.
- `css`: Set options for the css-loader used when loading CSS files.
- `test`: File extensions which support stylesheets
- `ruleId`: The ID of the webpack-chain rule used to identify the stylesheet loaders
- `styleUseId`: The ID of the webpack-chain `use` used to identify the style-loader
- `cssUseId`: The ID of the webpack-chain `use` used to identify the css-loader
- `hotUseId`: The ID of the  webpack-chain `use` used to identify the css-hot-loader
- `hot`: Enable usage of CSS Hot Module Replacement. Set to `false` to disable.
- `modules`: Enable usage of CSS modules via `*.module.css` files. Set to `false` to disable and skip defining these rules.
- `modulesSuffix`: A suffix added to `ruleId`, `styleUseId`, `cssUseId`, `hotUseId`, and `extractId` to derive names for
modules-related rules. For example, the default `-modules` suffix will generate a rule ID for the CSS modules rules of
`style-modules`, while the normal rule remains as `style`.
- `modulesTest`: File extensions which support CSS Modules stylesheets
- `extractId`: The ID of the webpack-chain plugin used to identify the `ExtractTextPlugin`
- `extract`: Options relating to the `ExtractTextPlugin` instance. Override `extract.plugin` to override plugin options.
Override `extract.loader` to override the loader options. Set to `false` to disable stylesheet extraction.

## Customization

`@neutrinojs/style-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of default rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `style` | Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css` which use `style-loader` and `css-loader`, respectively. | all |
| `style-modules` | Allows importing CSS Modules styles from modules. Contains two loaders named `style-modules` and `css-modules` which use `style-loader` and `css-loader`, respectively. | all |

### Plugins

The following is a default list of plugins and their identifiers which can be overridden:

_Note: Some plugins may be only available in certain environments. To override them, they should be modified conditionally._

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `extract` | Extracts CSS from JS bundle into a separate stylesheet file. | all |
| `extract-modules` | Extracts CSS from JS bundle into a separate stylesheet file. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](../../contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/style-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/style-loader.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/style-loader
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
