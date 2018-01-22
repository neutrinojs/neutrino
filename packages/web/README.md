# Neutrino Web Preset

`@neutrinojs/web` is a Neutrino preset that supports building generic applications for the web.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Features

- Zero upfront configuration necessary to start developing and building a web app
- Modern Babel compilation supporting ES modules, last 2 major browser versions, async functions, and dynamic imports
- webpack loaders for importing HTML, CSS, images, icons, fonts, and web workers
- webpack Dev Server during development
- Automatic creation of HTML pages, no templating necessary
- Automatic stylesheet extraction; importing stylesheets into modules creates bundled external stylesheets
- Pre-configured to support CSS Modules via `*.module.css` file extensions
- Hot Module Replacement support including CSS
- Tree-shaking to create smaller bundles
- Production-optimized bundles with Babel minification, easy chunking, and scope-hoisted modules for faster execution
- Easily extensible to customize your project as needed

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/web` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `@neutrinojs/web` are development dependencies.

#### Yarn

```bash
❯ yarn add --dev neutrino @neutrinojs/web
```

#### npm

```bash
❯ npm install --save-dev neutrino @neutrinojs/web
```

## Project Layout

`@neutrinojs/web` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to your compiled project.

## Quickstart

The fastest way to get started is by using the `create-project` scaffolding tool.
Don’t want to use the CLI helper? No worries, we have you covered with the [manual installation](#manual-installation).

### create-project

Run the following command to start the process. Substitute `<directory-name>` with the directory name you wish to create
for this project.


#### Yarn

```
❯ yarn create @neutrinojs/project <directory-name>
```

_Note: The `create` command is a shorthand that helps you do two things at once. See the [Yarn create docs](https://yarnpkg.com/lang/en/docs/cli/create) for more details._

#### npm/npx

[`npx`](https://github.com/zkat/npx) comes pre-installed with `npm`. If you’re running an older version of `npm`, then
`npm install -g npm` to update to the latest version.

```
❯ npx @neutrinojs/create-project <directory-name>
```

The CLI helper will prompt for the project to scaffold, and will offer to set
up a test runner as well as linting to your project. Refer to the [Create new project](../create-project) section
for details on all available options.

### Manual Installation

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
    "start": "neutrino start --use @neutrinojs/web",
    "build": "neutrino build --use @neutrinojs/web"
  }
}
```

If you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: ['@neutrinojs/web']
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

`@neutrinojs/web` builds static assets to the `build` directory by default when running `neutrino build`. Using the
quick start example above as a reference:

```bash
❯ yarn build

✔ Building project completed
Hash: 2e1191cdf700df46370d
Version: webpack 3.5.6
Time: 4145ms
                           Asset       Size    Chunks             Chunk Names
   index.523b6da56c6363aaf056.js    10.1 kB     index  [emitted]  index
 runtime.ce4090a4e87f82940ff0.js    1.51 kB   runtime  [emitted]  runtime
                      index.html  846 bytes            [emitted]
```

You can either serve or deploy the contents of this `build` directory as a static site.

## Static assets

If you wish to copy files to the build directory that are not imported from application code, you can place
them in a directory within `src` called `static`. All files in this directory will be copied from `src/static`
to `build/static`. To change this behavior, specify your own patterns with
[@neutrinojs/copy](https://neutrino.js.org/packages/copy/README.md).

## Paths

The `@neutrinojs/web` preset loads assets relative to the path of your application by setting webpack's
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) to `./`. If you wish to load
assets instead from a CDN, or if you wish to change to an absolute path for your application, customize your build to
override `output.publicPath`. See the [Customizing](#Customizing) section below.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this
preset builds. You can modify Web preset settings from `.neutrinorc.js` by overriding with an options object. Use
an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the Web preset and override its options:

```js
module.exports = {
  use: [
    ['@neutrinojs/web', {
      // Enables Hot Module Replacement. Set to false to disable
      hot: true,

      polyfills: {
        // Enables fast-async polyfill. Set to false to disable
        async: true
      },

      // Sets webpack's `output.publicPath` and
      // `devServer.publicPath` settings. Useful if you want to
      // serve assets from a non-root location (e.g. `/assets/`)
      publicPath: './',

      // Change options for @neutrinojs/style-loader
      style: {
        // Disabling options.hot will also disable style.hot
        hot: true
      },

      // Change options for @neutrinojs/font-loader
      font: {},

      // Change options for @neutrinojs/image-loader
      image: {},

      // Change options for @neutrinojs/minify
      minify: {},

      // Change options for `webpack-manifest-plugin`
      manifest: {},

      // Change options related to generating the HTML document
      // See @neutrinojs/html-template for the defaults
      // used by the Web preset
      html: {},

      // Change options related to starting a webpack-dev-server
      devServer: {
        // Disabling options.hot will also disable devServer.hot
        hot: options.hot
      },

      // Target specific browsers with babel-preset-env
      targets: {
        browsers: [
          'last 1 Chrome versions',
          'last 1 Firefox versions'
        ]
      },

      // Add additional Babel plugins, presets, or env options
      babel: {
        // Override options for babel-preset-env:
        presets: [
          ['babel-preset-env', {
            modules: false,
            useBuiltIns: true,
            exclude: ['transform-regenerator', 'transform-async-to-generator'],
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
    ['@neutrinojs/web', {
      /* preset options */

      // Example: disable Hot Module Replacement
      hot: false,

      // Example: disable image-loader, style-loader, font-loader,
      // font-loader, webpack-manifest-plugin
      image: false,
      style: false,
      font: false,
      manifest: false,

      // Example: Remove console and debugger from output
      minify: {
        babel: {
          removeConsole: true,
          removeDebugger: true,
        }
      },

      // Example: Use a .browserslistrc file with babel-env
      targets: {
        browsers: require('browserslist')()
      },

      // Remove the contents of the output directory prior to building.
      // Set to false to disable cleaning this directory
      clean: {
        paths: [neutrino.options.output]
      },

      // Example: change the page title
      html: {
        title: 'Epic Web App'
      },

      // Example: Proxy webpack-dev-server requests to http://localhost:3000
      devServer: {
        proxy: 'http://localhost:3000'
      }
    }]
  ]
};
```

### Dev Server Proxy

If you are handling requests with a server, you may want to set up a proxy for development. See webpack's [`devServer.proxy`](https://webpack.js.org/configuration/dev-server/#devserver-proxy) for all available options.

Optionally, you may pass a url string (instead of an object) to `devServer.proxy`.
This will proxy **all requests** through the given url, and set some sensible defaults.

For example:

```js
['@neutrinojs/web', {
  devServer: {
    proxy: 'http://localhost:3000'
  }
}
```

Is equivalent to:

```js
['@neutrinojs/web', {
  devServer: {
    proxy: {
      '**': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        headers: {
          'X-Dev-Server-Proxy': 'http://localhost:3000'
        }
      }
    }
  }
}
```

The `X-Dev-Server-Proxy` header can be useful for detecting if your existing app is being requested through the proxy.

## Hot Module Replacement

While `@neutrinojs/web` supports Hot Module Replacement your app, it does require some application-specific changes
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
`@neutrinojs/web` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

By default Neutrino, and therefore this preset, creates a single **main** `index` entry point to your application, and
this maps to the `index.*` file in the `src` directory. The extension is resolved by webpack. This value is provided by
`neutrino.options.mains` at `neutrino.options.mains.index`. This means that the Web preset is optimized toward the use
case of single-page applications over multi-page applications. If you wish to output multiple pages, you can detail
all your mains in your `.neutrinorc.js`.

```js
module.exports = {
  options: {
    mains: {
      index: 'index', // outputs index.html from src/index.*
      admin: 'admin', // outputs admin.html from src/admin.*
      account: 'user' // outputs account.html from src/user.*
    }
  },
  use: ['@neutrinojs/web']
}
```

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `compile` | Compiles JS files from the `src` directory using Babel. Contains a single loader named `babel`. From `@neutrinojs/compile-loader`. | all |
| `html` | Allows importing HTML files from modules. Contains a single loader named `html`. From `@neutrinojs/html-loader`. | all |
| `style` | Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css` which use `style-loader` and `css-loader`, respectively. From `@neutrinojs/style-loader`. | all |
| `style-modules` | Allows importing CSS Modules styles from modules. Contains two loaders named `style-modules` and `css-modules` which use `style-loader` and `css-loader`, respectively. From `@neutrinojs/style-loader`. | all |
| `img`, `svg`, `ico` | Allows import image files from modules. Each contains a single loader named `url`. From `@neutrinojs/image-loader`. | all |
| `woff`, `ttf` | Allows importing WOFF and TTF font files from modules. Each contains a single loader named `url`. From `@neutrinojs/font-loader`. | all |
| `eot` | Allows importing EOT font files from modules. Contains a single loader named `file`. From `@neutrinojs/font-loader`. | all |
| `worker` | Allows importing Web Workers automatically with `.worker.*` extensions. Contains a single loader named `worker`. | all |

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

_Note: Some plugins are only available in certain environments. To override them, they should be modified conditionally._

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `env` | Inject environment variables into source code at `process.env`, defaults to only inject `NODE_ENV`. From `@neutrinojs/env`. | all |
| `extract` | Extracts CSS from JS bundle into a separate stylesheet file. From `@neutrinojs/style-loader`. | all |
| `extract-modules` | Extracts CSS from JS bundle into a separate stylesheet file. From `@neutrinojs/style-loader`. | all |
| `html-{MAIN_NAME}` | Automatically generates HTML files for configured entry points. `{MAIN_NAME}` corresponds to the entry point of each page. By default, there is only a single `index` main, so this would generate a plugin named `html-index`. From `@neutrinojs/html-template` | all |
| `named-modules` | Enables named modules for improved debugging and console output. From `@neutrinojs/chunk` and `@neutrinojs/hot`. | `NODE_ENV production`, `start` command |
| `named-chunks` | Enables named chunks for improved debugging and console output. From `@neutrinojs/chunk`. | `NODE_ENV production` |
| `vendor-chunk` | Creates a separate file/chunk consisting of common modules shared between multiple entry points. From `@neutrinojs/chunk`. | `NODE_ENV production` |
| `runtime-chunk` | Creates a separate file/chunk consisting of the webpack manifest-specific code. From `@neutrinojs/chunk`. | `NODE_ENV production` |
| `name-all` | Names all remaining modules that do not get named via `named-modules`. From `@neutrinojs/chunk`. | `NODE_ENV production` |
| `hot` | Enables Hot Module Replacement. From `@neutrinojs/hot`. | `start` command |
| `copy` | Copies files during build, defaults from `src/static` to `build/static`. From `@neutrinojs/copy` | `build` command |
| `clean` | Removes the `build` directory prior to building. From `@neutrinojs/clean`. | `build` command |
| `babel-minify` | Minifies source code using `BabelMinifyWebpackPlugin`. From `@neutrinojs/minify`. | `NODE_ENV production` |
| `imagemin` | Optimize any images added by other webpack plugins (e.g. `copy-webpack-plugin`). From `@neutrinojs/minify`. | Enable with `options.minify.style`. |
| `optimize-css` | Minifies css using `OptimizeCssAssetsPlugin`. From `@neutrinojs/minify`. | `NODE_ENV production` |
| `module-concat` | Concatenate the scope of all your modules into one closure and allow for your code to have a faster execution time in the browser. | `NODE_ENV production` |
| `manifest` | Create a manifest file, via webpack-manifest-plugin. | `build` command |

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
    '@neutrinojs/web',
    neutrino => {
      neutrino.config
        .entry('vendor')
          .add('lodash');
    }
  ]
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/web.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/web.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/web
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
