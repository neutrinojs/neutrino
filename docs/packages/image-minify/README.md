# Neutrino Image Minify Middleware

`@neutrinojs/image-minify` is Neutrino middleware for optimizing images with imagemin.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/image-minify` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/image-minify
```

#### npm

```bash
❯ npm install --save @neutrinojs/image-minify
```

## Usage

`@neutrinojs/image-minify` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const images = require('@neutrinojs/image-loader');
const imagemin = require('@neutrinojs/image-minify');

// Use with default options
neutrino.use(images);
neutrino.use(imagemin);

// Usage showing default options
neutrino.use(imagemin, {
  imagemin: {
    plugins: [
      gifsicle(),
      svgo(),
      pngquant(),
      mozjpeg(),
      webp()
    ]
  },
  plugin: {
    name: '[path][name].[ext]',
    test: /\.(png|jpg|jpeg|gif|webp)$/
  },
  useId: 'imagemin',
  rules: ['svg', 'img'],
  pluginId: 'imagemin',
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@neutrinojs/image-minify']
};

// Usage showing default options
module.exports = {
  use: [
    ['@neutrinojs/image-minify', {
      imagemin: {},
      plugin: {
        name: '[path][name].[ext]',
        test: /\.(png|jpg|jpeg|gif|webp)$/
      },
      rules: ['svg', 'img'],
      pluginId: 'imagemin'
    }]
  ]
};
```

- `imagemin`: Set options for [imagemin](https://github.com/imagemin/imagemin#options).
- `plugin`: Set options for [imagemin-webpack](https://github.com/itgalaxy/imagemin-webpack#standalone-plugin)'s ImageminWebpackPlugin.
- `rules`: Specify rules for the application of imagemin.
- `pluginId`: The imagemin plugin identifier. Override this to add an additional imagemin plugin instance.

## Customization

`@neutrinojs/image-minify` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `img` | Optimize JPEG, PNG, GIF, and WEBP files imported from modules. Contains a single loader named `imagemin`. | all |
| `svg` | Optimize SVG files imported from modules. Contains a single loader named `imagemin`. | all |

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `imagemin` | Optimize any images added by other webpack plugins (e.g. `copy-webpack-plugin`). | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/image-minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/image-minify.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/image-minify
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
