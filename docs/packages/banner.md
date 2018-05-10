# banner

`@neutrinojs/banner` is Neutrino middleware for injecting string content into source code files.

![](https://img.shields.io/npm/v/@neutrinojs/banner.svg) ![](https://img.shields.io/npm/dt/@neutrinojs/banner.svg)

## Requirements

* Node.js v8.3+
* Yarn v1.2.1+, or npm v5.4+
* Neutrino v8

## Installation

`@neutrinojs/banner` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/banner
```

#### npm

```bash
❯ npm install --save @neutrinojs/banner
```

## Usage

`@neutrinojs/banner` can be consumed from the Neutrino API, middleware, or presets. Require this package and plug it into Neutrino:

```javascript
// Using function middleware format:
const banner = require('@neutrinojs/banner');

// Use with default options
neutrino.use(banner);

// Also accepts options for webpack's BannerPlugin
// https://webpack.js.org/plugins/banner-plugin/

// Usage shows the default values of this middleware:
neutrino.use(banner, {
  banner: `require('source-map-support').install();`,
  raw: true,
  entryOnly: true,
  // Override pluginId to add an additional banner plugin instance
  pluginId: 'banner'
});
```

```javascript
// Using object or array middleware format:
const banner = require('@neutrinojs/banner');

// Use with default options
module.exports = {
  use: ['@neutrinojs/banner']
};

// Also accepts options for webpack's BannerPlugin
// https://webpack.js.org/plugins/banner-plugin/

// Usage shows the default values of this middleware:
module.exports = {
  use: [
    ['@neutrinojs/banner', {
      banner: `require('source-map-support').install();`,
      raw: true,
      entryOnly: true,
      // Override pluginId to add an additional banner plugin instance
      pluginId: 'banner'
    }]
  ]
};
```

## Customization

`@neutrinojs/banner` creates some conventions to make overriding the configuration easier once you are ready to make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `banner` | Injects string content into application source code. | all |

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo containing all resources for developing Neutrino and its core presets and middleware. Follow the [contributing guide](https://neutrino.js.org/contributing) for details.

