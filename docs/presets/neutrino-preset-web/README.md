# Neutrino Web Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-web` is a Neutrino preset that supports building generic applications for the web.

## Features

- Zero upfront configuration necessary to start developing and building a web app
- Modern Babel compilation supporting ES modules, last 2 major browser versions, and async functions
- Webpack loaders for importing HTML, CSS, images, icons, and fonts
- Webpack Dev Server during development
- Automatic creation of HTML pages, no templating necessary
- Hot Module Replacement support
- Tree-shaking to create smaller bundles
- Production-optimized bundles with Babili minification and easy chunking
- Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v4

## Installation

`neutrino-preset-web` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-web` are development dependencies.

#### Yarn

```bash
❯ yarn add --dev neutrino neutrino-preset-web
```

#### npm

```bash
❯ npm install --save-dev neutrino neutrino-preset-web
```

## Project Layout

`neutrino-preset-web` follows the standard [project layout](/project-layout.md) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to your compiled project.

## Quickstart

After installing Neutrino and the Web preset, add a new directory named `src` in the root of the project, with
a single JS file named `index.js` in it.

```bash
❯ mkdir src && touch src/index.js
```

This Web preset exposes an element in the page with an ID of `root` to which you can mount your application. Edit
your `src/index.js` file with the following:

```js
const app = document.createElement('main');
const text = document.createTextNode('Hello world!');

app.appendChild(text);
document.getElementById('root').appendChild(app);
```

Now edit your project's package.json to add commands for starting and building the application:

```json
{
  "scripts": {
    "start": "neutrino start --presets neutrino-preset-web",
    "build": "neutrino build --presets neutrino-preset-web"
  }
}
```

Start the app, then open a browser to the address in the console:

#### Yarn

```bash
❯ yarn start
✔ Development server running on: http://localhost:5000
✔ Build completed
```

#### npm

```bash
❯ npm start
✔ Development server running on: http://localhost:5000
✔ Build completed
```

## Building

`neutrino-preset-web` builds static assets to the `build` directory by default when running `neutrino build`. Using the
quick start example above as a reference:

```bash
❯ yarn build
clean-webpack-plugin: /web/build has been removed.
Build completed in 0.779s

Hash: 55c33df4cd1222a03505
Version: webpack 2.2.1
Time: 784ms
                                  Asset       Size  Chunks             Chunk Names
   index.52f2d06086f51d21f9c9.bundle.js  213 bytes    0, 1  [emitted]  index
manifest.c10c6464802bf71a2c3f.bundle.js    1.41 kB       1  [emitted]  manifest
                             index.html  779 bytes          [emitted]
✨  Done in 2.10s.
```

You can either serve or deploy the contents of this `build` directory as a static site.

## Customizing

To override the build configuration, start with the documentation on [customization](/customization/README.md).
`neutrino-preset-web` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

By default the Web preset creates a single **main** `index` entry point to your application, and this maps to the
`index.js` file in the `src` directory. This means that the Web preset is optimized toward the use case of single-page
applications over multi-page applications.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `compile`: Compiles JS files from the `src` directory using Babel. Contains a single loader named `babel`.
- `html`: Allows importing HTML files from modules. Contains a single loader named `file`.
- `css`: Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css`.
- `img`, `svg`, `ico`: Allows import image files from modules. Each contains a single loader named `url`.
- `woff`, `ttf`: Allows importing WOFF and TTF font files from modules. Each contains a single loader named `url`.
- `eot`: Allows importing EOT font files from modules. Contains a single loader named `file`.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `env`: Injects the value of `NODE_ENV` into the application as `process.env.NODE_ENV`.
- `html`: Creates HTML files when building. Has various options that can be configured via package.json.
- `chunk`: Defines chunks for `manifest` and `vendor` entry points. Can be configured via package.json.
- `hot`: Enables hot module reloading.
- `copy`: Copies non-JS files from `src` to `build` when using `neutrino build`.
- `clean`: Clears the contents of `build` prior to creating a production bundle.
- `progress`: Displays a progress bar when using `neutrino build`.

### Simple customization

By following the [customization guide](/customization/simple.md) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build directly from package.json.

#### Vendoring

By defining an entry point in package.json named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put lodash into a separate "vendor" chunk:_

```json
{
  "config": {
    "neutrino": {
      "entry": {
        "vendor": [
          "lodash"
        ]
      }
    }
  },
  "dependencies": {
    "lodash": "*"
  }
}
```

#### HTML files

Under the hood `neutrino-preset-web` uses [html-webpack-template](https://www.npmjs.com/package/html-webpack-template)
for generating HTML files. If you wish to override how these files are creating, define an object in your package.json
at `config.html` with options matching the format expected by html-webpack-template.

_Example: Change the application mount ID from "root" to "app":_

```json
{
  "config": {
    "html": {
      "appMountId": "app"
    }
  }
}
```

### Advanced configuration

By following the [customization guide](/customization/advanced.md) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by creating a JS module which overrides the config.

#### Vendoring

By defining an entry point named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put lodash into a separate "vendor" chunk:_

```js
module.exports = neutrino => {
  neutrino.config
    .entry('vendor')
    .add('lodash');
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](/contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-web.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-web.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-web
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
