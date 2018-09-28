# Neutrino HTML Template Middleware

`@neutrinojs/html-template` is Neutrino middleware for automatically creating HTML files for configured
entry points.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]

## Requirements

- Node.js ^8.10 or 10+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 9
- webpack 4

## Installation

`@neutrinojs/html-template` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/html-template
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/html-template
```

## Usage

`@neutrinojs/html-template` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format

// Usage shows default values
// Accepts options specified by html-webpack-plugin:
// https://github.com/jantimon/html-webpack-plugin#configuration
neutrino.use(template, {
  // @neutrinojs/html-template includes a custom template that has more features
  // (eg appMountId and lang support) than the default html-webpack-plugin template:
  // https://github.com/jantimon/html-webpack-plugin/blob/master/default_index.ejs
  template: require.resolve('@neutrinojs/html-template/template.ejs'),
  appMountId: 'root',
  lang: 'en',
  meta: {
    viewport: 'width=device-width, initial-scale=1'
  },
  // Override pluginId to add an additional html-template plugin instance
  pluginId: 'html'
});

// Most commonly, you will want to override the initial page title:
neutrino.use(template, {
  title: 'React Application'
});
```

```js
// Using object or array middleware format

// Usage shows default values
// Accepts options specified by html-webpack-plugin:
// https://github.com/jantimon/html-webpack-plugin#configuration
module.exports = {
  use: [
    ['@neutrinojs/html-template', {
      // @neutrinojs/html-template includes a custom template that has more features
      // (eg appMountId and lang support) than the default html-webpack-plugin template:
      // https://github.com/jantimon/html-webpack-plugin/blob/master/default_index.ejs
      template: require.resolve('@neutrinojs/html-template/template.ejs'),
      appMountId: 'root',
      lang: 'en',
      meta: {
        viewport: 'width=device-width, initial-scale=1'
      },
      // Override pluginId to add an additional html-template plugin instance
      pluginId: 'html'
    }]
  ]
};

// Most commonly, you will want to override the initial page title:
module.exports = {
  use: [
    ['@neutrinojs/html-template', {
      title: 'React Application'
    }]
  ]
};
```

## Customization

`@neutrinojs/html-template` creates some conventions to make overriding the configuration easier once you are ready to
make changes.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

| Name | Description | NODE_ENV |
| --- | --- | --- |
| `html` | Automatically generates HTML files for configured entry points. | all |

## Contributing

This middleware is part of the [neutrino](https://github.com/neutrinojs/neutrino) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/html-template.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/html-template.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/html-template
