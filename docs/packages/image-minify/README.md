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
const imagemin = require('@neutrinojs/image-minify');

// Use with default options
neutrino.use(imagemin);

// Usage showing default options
neutrino.use(imagemin, {
  imagemin: {
    plugins: [
      optipng(),
      gifsicle(),
      jpegtran(),
      svgo(),
      webp()
    ],
    optipng: {},
    gifsicle: {},
    jpegtran: {},
    svgo: {},
    pngquant: null,
    webp: {}
  },
  pluginId: 'imagemin'
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
      imagemin: {
        plugins: [
          optipng(),
          gifsicle(),
          jpegtran(),
          svgo(),
          webp()
        ],
        optipng: {},
        gifsicle: {},
        jpegtran: {},
        svgo: {},
        pngquant: null,
        webp: {}
      },
      pluginId: 'imagemin'
    }]
  ]
};
```

- `imagemin`: Set options for [imagemin](https://github.com/Klathmon/imagemin-webpack-plugin). See below for specific options.
- `pluginId`: The `imagemin` plugin identifier. Override this to add an additional imagemin plugin instance.

## Customization

`@neutrinojs/image-minify` creates some conventions to make overriding the configuration easier once you are
ready to make changes.

### Imagemin Options

The `imagemin` option can accept options related to the
[`ImageminWebpackPlugin`](https://github.com/Klathmon/imagemin-webpack-plugin). Typically this includes an array of
additional plugins you wish to add beyond the defaults, or setting options for the default plugins this middleware
uses. This middleware uses all the default settings for `imagemin-webpack-plugin`, and adds the following
_additional option_:

- `imagemin.webp`: Passes the given object to [`imagemin-webp`](https://github.com/imagemin/imagemin-webp). Set to null
to disable `webp` optimization.

If you wish to add additional plugins, you can pass an instance of the plugin to the `imagemin.plugins` array.

_Example: Use `imagemin-zopfli` with `8bit` option_:

```js
const zopfli = require('imagemin-zopfli');

module.exports = {
  use: [
    ['@neutrinojs/image-minify', {
      imagemin: {
        plugins: [
          zopfli({
            '8bit': true
          })
        ],
      },
    }]
  ]
};
```

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `imagemin` | Optimize any images used by your project. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/image-minify.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/image-minify.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/image-minify
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
