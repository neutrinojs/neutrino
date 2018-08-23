# Neutrino Image Minify Middleware

`@neutrinojs/image-minify` is Neutrino middleware for optimizing images with imagemin.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
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
  enabled: process.env.NODE_ENV === 'production',
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
    test: /\.(ico|png|jpg|jpeg|gif|svg|webp)$/
  },
  useId: 'imagemin',
  rules: ['image'],
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
      enabled: process.env.NODE_ENV === 'production',
      imagemin: {},
      plugin: {
        name: '[path][name].[ext]',
        test: /\.(ico|png|jpg|jpeg|gif|svg|webp)$/
      },
      rules: ['image'],
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
| `image` | Optimize JPEG, PNG, GIF, SVG and WEBP files imported from modules. Contains a single loader named `imagemin`. | all |

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `imagemin` | Optimize any images added by other webpack plugins (e.g. `copy-webpack-plugin`). | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/image-minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/image-minify.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/image-minify
