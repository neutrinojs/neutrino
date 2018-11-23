# Neutrino Style Loader Middleware

`@neutrinojs/style-loader` is Neutrino middleware for loading and importing stylesheets from modules.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Features

- Zero upfront configuration necessary to import stylesheets into modules
- Automatic stylesheet extraction; importing stylesheets into modules creates bundled external stylesheets
- Pre-configured to support CSS Modules via `*.module.css` file extensions
- CSS Hot Module Replacement support
- Very extensible to customize as needed

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9
- webpack 4

## Installation

`@neutrinojs/style-loader` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/style-loader
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/style-loader
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
  css: {
    importLoaders: opts.loaders ? opts.loaders.length : 0
  },
  loaders: [],
  test: /\.css$/,
  ruleId: 'style',
  styleUseId: 'style',
  cssUseId: 'css',
  modules: true,
  modulesSuffix: '-modules',
  modulesTest: /\.module.css$/,
  extractId: 'extract',
  extract: {
    enabled: process.env.NODE_ENV === 'production',
    loader: {},
    plugin: {
      filename: process.env.NODE_ENV === 'production'
        ? 'assets/[name].[contenthash:8].css'
        : 'assets/[name].css'
    }
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
      css: {
        importLoaders: opts.loaders ? opts.loaders.length : 0
      },
      loaders: [],
      test: /\.css$/,
      ruleId: 'style',
      styleUseId: 'style',
      cssUseId: 'css',
      modules: true,
      modulesSuffix: '-modules',
      modulesTest: /\.module.css$/,
      extractId: 'extract',
      extract: {
        enabled: process.env.NODE_ENV === 'production',
        loader: {},
        plugin: {
          filename: process.env.NODE_ENV === 'production'
            ? 'assets/[name].[contenthash:8].css'
            : 'assets/[name].css'
        }
      }
    }]
  ]
};
```

- `style`: Set options for the style-loader used when loading CSS files.
- `css`: Set options for the css-loader used when loading CSS files.
- `loaders`: Provide an array of custom loaders used when loading stylesheets
- `test`: File extensions which support stylesheets
- `ruleId`: The ID of the webpack-chain rule used to identify the stylesheet loaders
- `styleUseId`: The ID of the webpack-chain `use` used to identify the style-loader
- `cssUseId`: The ID of the webpack-chain `use` used to identify the css-loader
- `modules`: Enable usage of CSS modules via `*.module.css` files. Set to `false` to disable and skip defining these rules.
- `modulesSuffix`: A suffix added to `ruleId`, `styleUseId`, `cssUseId`, `hotUseId`, and `extractId` to derive names for
modules-related rules. For example, the default `-modules` suffix will generate a rule ID for the CSS modules rules of
`style-modules`, while the normal rule remains as `style`.
- `modulesTest`: File extensions which support CSS Modules stylesheets
- `extractId`: The ID of the webpack-chain plugin used to identify the `ExtractTextPlugin`
- `extract`: Options relating to the `ExtractTextPlugin` instance. Override `extract.plugin` to override plugin options.
Override `extract.loader` to override the loader options. Set to `false` to disable stylesheet extraction.

## Custom Loaders

You may wish to perform custom loading on your stylesheets by using SASS, LESS, postcss, and more. You can do this
by providing an array of custom loaders to the `loaders` options to this middleware. Each item in the `loaders` array
corresponds to a webpack loader to use, and can be defined as an object  or as a string.

Using an object to define loaders is preferred since it allows options to be overridable in the future, and
by other consuming middleware. Each loader object can specify 3 properties:

- `loader`: A string referencing the path to the loader to use, e.g. `sass-loader` or `require.resolve('less-loader')`.
- `options`: An object specifying any options needed by the loader.
- `useId`: A string identified for the loader, used to reference the loader in the future for overrides or customization by other middleware.

Using a string to define loaders will cause `@neutrinojs/style-loader` to still generate a loader object. The string
will be used as the `loader` property, `options` will be left blank, and the `useId` will be derived from
`cssUseId` option above plus the index of this loader within the `loaders` array.

**Important:** The `useId` for string-defined loaders will start at `2`, since all loaders are preceded by the included
`style-loader` and `css-loader`.

```js
module.exports = {
  use: ['@neutrinojs/style-loader', {
    // Override the default file extension of `.css` if needed
    test: /\.(css|sass|scss)$/,
    moduleTest: /\.module\.(css|sass|scss)$/,
    loaders: [
      // Define loaders as objects. Note: loaders must be specified in reverse order.
      // ie: for the loaders below the actual execution order would be:
      // input file -> sass-loader -> postcss-loader -> css-loader -> style-loader/mini-css-extract-plugin
      {
        loader: 'postcss-loader',
        options: {
          plugins: [require('autoprefixer')]
        }
      },
      {
        loader: 'sass-loader',
        useId: 'sass',
        options: {
          includePaths: ['absolute/path/a', 'absolute/path/b']
        }
      }
    ]
  }]
}
```

```js
module.exports = {
  use: ['@neutrinojs/style-loader', {
    loaders: [
      // Define loaders as strings
      // This will cause this middleware to generate a
      // loader with a useId of `css-2`.
      'sass-loader'

      // Adding any other loaders will increment the useId
      // to `css-3`, `css-4`, etc.
    ]
  }]
}
```

Due to the inferred loader names, we highly recommend you stick to using objects
to define loaders.

### Loader Configuration

You can configure loaders directly by passing `options`.
For PostCSS, if you want to use an [external config file](https://github.com/michael-ciniawsky/postcss-load-config),
you need to pass `options.config`:

```js
// .neutrinorc.js
module.exports = {
  use: ['@neutrinojs/style-loader', {
    loaders: [
      {
        loader: 'postcss-loader',
        useId: 'postcss',
        options: {
          config: {

            // Where to look for config (postcss.config.js)
            // https://github.com/postcss/postcss-loader#path
            // See "Loader Configuration" below
            path: neutrino.options.root
          }
        }
      }
    ]
  }]
}
```

```js
// .postcssrc.js
// Example: load tailwindcss plugin
module.exports = {
  plugins: {
    tailwindcss: {},
  }
};
```

## Customization

`@neutrinojs/style-loader` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of default rules and their identifiers which can be overridden:

| Name | Description | NODE_ENV |
| --- | --- | --- |
| `style` | Allows importing CSS stylesheets from modules. By default contains two loaders named `extract` and `css` which use `MiniCssExtractPlugin.loader` and `css-loader`, respectively. If `options.extract` is `false`, then the `extract` loader is replaced by `style`, which uses `style-loader`. | all |
| `style-modules` | Allows importing CSS Modules styles from modules. By default contains two loaders named `extract` and `css` which use `MiniCssExtractPlugin.loader` and `css-loader`, respectively. If `options.extract` is `false`, then the `extract` loader is replaced by `style`, which uses `style-loader`. | all |

### Plugins

The following is a default list of plugins and their identifiers which can be overridden:

_Note: Some plugins may be only available in certain environments. To override them, they should be modified conditionally._

| Name | Description | NODE_ENV |
| --- | --- | --- |
| `extract` | Extracts CSS from JS bundle into a separate stylesheet file. | `'production'` |

## Contributing

This middleware is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/style-loader.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/style-loader.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/style-loader
