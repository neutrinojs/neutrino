# Neutrino Web Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-web` is a Neutrino preset that supports building generic applications for the web.

## Features

- Zero upfront configuration necessary to start developing and building a web app
- Modern Babel compilation supporting ES modules, last 2 major browser versions, async functions, and dynamic imports
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

`neutrino-preset-web` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
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
    "start": "neutrino start --use neutrino-preset-web",
    "build": "neutrino build --use neutrino-preset-web"
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

## Hot Module Replacement

While `neutrino-preset-web` supports Hot Module Replacement your app, it does require some application-specific changes
in order to operate. Your application should define split points for which to accept modules to reload using
`module.hot`:

For example:

```js
import app from './app';

document
  .getElementById('root')
  .appendChild(app('Hello world!'));

if (module.hot) {
  module.hot.accept('./app');
}
```

Or for all paths:

```js
import app from './app';

document
  .getElementById('root')
  .appendChild(app('Hello world!'));

if (module.hot) {
  module.hot.accept();
}
```

Using dynamic imports with `import()` will automatically create split points and hot replace those modules upon
modification during development.

## Paths

By default this preset loads assets relative to the path of your application by setting Webpack's
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) to `./`. If you wish to load
assets instead from a CDN, or if you wish to change to an absolute path for your application, customize your build to
override `output.publicPath`. See the [Customizing](#Customizing) section below.

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-web` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

By default the Web preset creates a single **main** `index` entry point to your application, and this maps to the
`index.js` file in the `src` directory. This value is provided by `neutrino.options.entry`.
This means that the Web preset is optimized toward the use case of single-page applications over multi-page
applications.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `compile`: Compiles JS files from the `src` directory using Babel. Contains a single loader named `babel`.
- `html`: Allows importing HTML files from modules. Contains a single loader named `file`.
- `style`: Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css`.
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

### Simple customization

By following the [customization guide](https://neutrino.js.org/customization/simple) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build directly from package.json.

#### Compile targets

This preset uses babel-preset-env to compile code targeting the last 2 browser versions of major browsers. To change
the browser targets from package.json, specify an object at `neutrino.options.compile.targets` which contains a
[browserlist-compatible](https://github.com/ai/browserslist) array of browser targets.

_Example: Replace the Web preset browser targets with support for browsers with greater than 5% global usage:_

```json
{
  "neutrino": {
    "options": {
      "compile": {
        "targets": {
          "browsers": [
            "> 5%"
          ]
        }
      }
    }
  }
}
```

_Example: Change support to latest version instead of last 2 versions:_

```json
{
  "neutrino": {
    "options": {
      "compile": {
        "targets": {
          "browsers": [
            "last 1 version"
          ]
        }
      }
    }
  }
}
```

#### Vendoring

By defining an entry point in package.json named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put lodash into a separate "vendor" chunk:_

```json
{
  "neutrino": {
    "config": {
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
for generating HTML files. If you wish to override how these files are created, define an object in your package.json
at `neutrino.options.html` with options matching the format expected by html-webpack-template.

_Example: Change the application mount ID from "root" to "app":_

```json
{
  "neutrino": {
    "options": {
      "html": {
        "appMountId": "app"
      }
    }
  }
}
```

### Advanced configuration

By following the [customization guide](https://neutrino.js.org/customization/advanced) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by creating a JS module which overrides the config.

#### Compile targets

This preset uses babel-preset-env to compile code targeting the last 2 browser versions of major browsers. To change
the browser targets from an override file, specify an object at `neutrino.options.compile.targets` which contains a
[browserlist-compatible](https://github.com/ai/browserslist) array of browser targets.

**Note: Setting these options via `neutrino.options.compile` must be done prior to loading the Web preset or they
will not be picked up by the compile middleware. These examples show changing compile targets with options before
loading the preset and overriding them if loaded afterwards.**

_Example: Replace the Web preset browser targets with support for browsers with greater than 5% global usage:_

```js
module.exports = neutrino => {
  // Using neutrino.options prior to loading Web preset
  neutrino.options.compile = {
    targets: {
      browsers: ['> 5%']
    }
  };

  // Using compile options override following loading Web preset
  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(options => {
      options.presets[0][1].targets.browsers = ['> 5%'];

      return options;
    });
};
```

_Example: Change support to latest version instead of last 2 versions:_

```js
module.exports = neutrino => {
  // Using neutrino.options prior to loading Web preset
  neutrino.options.compile = {
    targets: {
      browsers: ['last 1 version']
    }
  };

  // Using compile options override following loading Web preset
  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(options => {
      options.presets[0][1].targets.browsers = ['last 1 version'];

      return options;
    });
};
```

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

#### HTML files

_Example: Change the application mount ID from "root" to "app":_

```js
const merge = require('deepmerge');

module.exports = neutrino => {
  neutrino.options.html.appMountId = 'app';
};
```

#### Polyfills

Neutrino automatically includes babel-polyfill in a `polyfill` bundle which includes the necessary polyfills needed
based on your compile targets. To remove the inclusion of babel-polyfill, you will need to remove this entrypoint:

```js
module.exports = neutrino => {
  neutrino.config.entryPoints.delete('polyfill');
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-web.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-web.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-web
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
