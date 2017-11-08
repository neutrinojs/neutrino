# Neutrino Web Preset

`neutrino-preset-web` is a Neutrino preset that supports building generic applications for the web.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Features

- Zero upfront configuration necessary to start developing and building a web app
- Modern Babel compilation supporting ES modules, last 2 major browser versions, async functions, and dynamic imports
- Webpack loaders for importing HTML, CSS, images, icons, fonts, and web workers
- Webpack Dev Server during development
- Automatic creation of HTML pages, no templating necessary
- Hot Module Replacement support
- Tree-shaking to create smaller bundles
- Production-optimized bundles with Babili minification, easy chunking, and scope-hoisted modules for faster execution
- Easily extensible to customize your project as needed

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7

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

If you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: ['neutrino-preset-web']
};
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

✔ Building project completed
Hash: 2e1191cdf700df46370d
Version: webpack 3.5.6
Time: 4145ms
                           Asset       Size    Chunks             Chunk Names
   index.523b6da56c6363aaf056.js    10.1 kB     index  [emitted]  index
polyfill.57dabda41992eba7552f.js    69.2 kB  polyfill  [emitted]  polyfill
 runtime.ce4090a4e87f82940ff0.js    1.51 kB   runtime  [emitted]  runtime
                      index.html  846 bytes            [emitted]
```

You can either serve or deploy the contents of this `build` directory as a static site.

## Static assets

If you wish to copy files to the build directory that are not imported from application code, you can place
them in a directory within `src` called `static`. All files in this directory will be copied from `src/static`
to `build/static`. To change this behavior, specify your own patterns with
[neutrino-middleware-copy](../../middleware/neutrino-middleware-copy/README.md).

## Paths

The `neutrino-preset-web` preset loads assets relative to the path of your application by setting Webpack's
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) to `./`. If you wish to load
assets instead from a CDN, or if you wish to change to an absolute path for your application, customize your build to
override `output.publicPath`. See the [Customizing](#Customizing) section below.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this
preset builds. You can modify Web preset settings from `.neutrinorc.js` by overriding with an options object. Use
an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the Web preset and override its options, showing the defaults:

```js
module.exports = {
  use: [
    ['neutrino-preset-web', {
      // Enables Hot Module Replacement. Set to false to disable
      hot: true,

      polyfills: {
        // Enables fast-async polyfill. Set to false to disable
        async: true
      },

      // Change options related to generating the HTML document
      // See neutrino-middleware-html-template for the defaults
      // used by the Web preset
      html: {},

      // Change options related to starting a webpack-dev-server
      // See neutrino-middleware-html-template for the defaults
      // used by the Web preset
      devServer: {
        // Disabling options.hot will also disable devServer.hot
        hot: options.hot
      },

      // Add additional Babel plugins, presets, or env options
      babel: {
        // Override options for babel-preset-env
        presets: [
          ['babel-preset-env', {
            // Passing in targets to babel-preset-env will replace them
            // instead of merging them
            targets: {
              browsers: [
                'last 1 Chrome versions',
                'last 1 Firefox versions'
              ]
            }
          }]
        ]
      }
    }]
  ]
};
```

_Example: Disable Hot Module Replacement and change the page title:_

```js
module.exports = {
  use: [
    ['neutrino-preset-web', {
      /* preset options */

      // Example: disable Hot Module Replacement
      hot: false,

      // Example: change the page title
      html: {
        title: 'Epic Web App'
      }
    }]
  ]
};
```

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

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-web` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

By default the Web preset creates a single **main** `index` entry point to your application, and this maps to
the `index.*` file in the `src` directory. The extension is resolved by Webpack. This value is provided by
`neutrino.options.entry`. This means that the Web preset is optimized toward the use case of single-page
applications over multi-page applications.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `compile` | Compiles JS files from the `src` directory using Babel. Contains a single loader named `babel`. From `neutrino-middleware-compile-loader`. | all |
| `html` | Allows importing HTML files from modules. Contains a single loader named `html`. From `neutrino-middleware-html-loader`. | all |
| `style` | Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css`. From `neutrino-middleware-style-loader`. | all |
| `img`, `svg`, `ico` | Allows import image files from modules. Each contains a single loader named `url`. From `neutrino-middleware-image-loader`. | all |
| `woff`, `ttf` | Allows importing WOFF and TTF font files from modules. Each contains a single loader named `url`. From `neutrino-middleware-font-loader`. | all |
| `eot` | Allows importing EOT font files from modules. Contains a single loader named `file`. From `neutrino-middleware-font-loader`. | all |
| `worker` | Allows importing Web Workers automatically with `.worker.js` extensions. Contains a single loader named `worker`. | all |

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

_Note: Some plugins are only available in certain environments. To override them, they should be modified conditionally._

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `env` | Inject environment variables into source code at `process.env`, defaults to only inject `NODE_ENV`. From `neutrino-middleware-env`. | all |
| `html` | Automatically generates HTML files for configured entry-points. From `neutrino-middleware-html-template` | all |
| `named-modules` | Enables named modules for improved debugging and console output. From `neutrino-middleware-chunk` and `neutrino-middleware-hot`. | `NODE_ENV production`, `start` command |
| `named-chunks` | Enables named chunks for improved debugging and console output. From `neutrino-middleware-chunk`. | `NODE_ENV production` |
| `vendor-chunk` | Creates a separate file/chunk consisting of common modules shared between multiple entry points. From `neutrino-middleware-chunk`. | `NODE_ENV production` |
| `runtime-chunk` | Creates a separate file/chunk consisting of the Webpack manifest-specific code. From `neutrino-middleware-chunk`. | `NODE_ENV production` |
| `name-all` | Names all remaining modules that do not get named via `named-modules`. From `neutrino-middleware-chunk`. | `NODE_ENV production` |
| `hot` | Enables Hot Module Replacement. From `neutrino-middleware-hot`. | `start` command |
| `copy` | Copies files during build, defaults from `src/static` to `build/static`. From `neutrino-middleware-copy` | `build` command |
| `clean` | Removes the `build` directory prior to building. From `neutrino-middleware-clean`. | `build` command |
| `minify` | Minifies source code using `BabiliWebpackPlugin`. From `neutrino-middleware-minify`. | `NODE_ENV production` |
| `module-concat` | Concatenate the scope of all your modules into one closure and allow for your code to have a faster execution time in the browser. | `NODE_ENV production` |

### Override configuration

By following the [customization guide](https://neutrino.js.org/customization) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by by providing a function to your `.neutrinorc.js` use array. You can also
make these changes from the Neutrino API in custom middleware.

#### Vendoring

By defining an entry point named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put lodash into a separate "vendor" chunk:_

```js
module.exports = {
  use: [
    'neutrino-preset-web',
    neutrino => neutrino.config.entry('vendor').add('lodash')
  ]
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-web.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-web.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-web
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
