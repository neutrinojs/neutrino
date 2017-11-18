# Neutrino Preact Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url]  
`neutrino-preset-preact` is a Neutrino preset that supports building Preact web applications.

## Features

- Zero upfront configuration necessary to start developing and building a Preact web app
- Modern Babel compilation adding JSX and object rest spread syntax.
- ~~Support for React Hot Loader~~
- Support for ES6/7 class properties and experimental decorators.
- Write JSX in .js or .jsx files
- Extends from [neutrino-preset-web](https://neutrino.js.org/presets/neutrino-preset-web)
  - Modern Babel compilation supporting ES modules, last 2 major browser versions, async functions, and dynamic imports
  - Webpack loaders for importing HTML, CSS, images, icons, and fonts
  - Webpack Dev Server during development
  - Automatic creation of HTML pages, no templating necessary
  - Hot module replacement support<sup>*</sup>
  - Production-optimized bundles with Babili minification and easy chunking
  - Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-preset-preact` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-preact` are development dependencies. You will also need Preact and Preact-compat (recommended) for actual
Preact development.

#### Yarn

```bash
❯ yarn add --dev neutrino neutrino-preset-preact
❯ yarn add preact preact-compat
```

#### npm

```bash
❯ npm install --save-dev neutrino neutrino-preset-preact
❯ npm install --save preact preact-compat
```

## Project Layout

`neutrino-preset-preact` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to your compiled project.

## Quickstart

After installing Neutrino and the Preact preset, add a new directory named `src` in the root of the project, with
a single JS file named `index.js` in it.

```bash
❯ mkdir src && touch src/index.js
```

This Preact preset exposes an element in the page with an ID of `root` to which you can mount your application. Edit
your `src/index.js` file with the following:

```jsx
import { h, render } from 'preact';

render(<h1>Hello world!</h1>, document.body, document.getElementById('root'));
```

Now edit your project's package.json to add commands for starting and building the application:

```json
{
  "scripts": {
    "start": "neutrino start --use neutrino-preset-preact",
    "build": "neutrino build --use neutrino-preset-preact"
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

`neutrino-preset-preact` builds static assets to the `build` directory by default when running `neutrino build`. Using
the quick start example above as a reference:

```bash
❯ yarn build
clean-webpack-plugin: /preact/build has been removed.
Build completed in 6.692s

Hash: 7a83f769b15f88b80727
Version: webpack 2.2.1
Time: 6695ms
                                  Asset       Size  Chunks             Chunk Names
   index.b615ea9e95317f530317.bundle.js     143 kB    0, 1  [emitted]  index
manifest.2211d9c1970bbd3c952b.bundle.js    1.41 kB       1  [emitted]  manifest
                             index.html  779 bytes          [emitted]
✨  Done in 8.32s.
```

You can either serve or deploy the contents of this `build` directory as a static site.

## Paths

The `neutrino-preset-web` preset loads assets relative to the path of your application by setting Webpack's
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) to `./`. If you wish to load
assets instead from a CDN, or if you wish to change to an absolute path for your application, customize your build to
override `output.publicPath`. See the [Customizing](#Customizing) section below.

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-preact` does not use any additional named rules, loaders, or plugins that aren't already in use by the
Web preset. See the [Web documentation customization](https://neutrino.js.org/presets/neutrino-preset-web#customizing)
for preset-specific configuration to override.

### Simple customization

By following the [customization guide](https://neutrino.js.org/customization/simple) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build directly from package.json.

#### Vendoring

By defining an entry point in package.json named `vendor` you can split out external dependencies into a chunk separate
from your application code. When working with a Preact application, it is recommended to start out by splitting off
Preact and Preact-compat into the `vendor` chunk.

_Example: Put Preact and Preact-compat into a separate "vendor" chunk:_

```json
{
  "neutrino": {
    "config": {
      "entry": {
        "vendor": [
          "preact",
          "preact-compat"
        ]
      }
    }
  },
  "dependencies": {
    "preact": "^8.1.0",
    "preact-compat": "^3.16.0"
  }
}
```

Running the build again, you can contrast the bundles generated here with the one generated in the quick start:

```bash
❯ yarn build
clean-webpack-plugin: /preact/build has been removed.
Build completed in 6.726s

Hash: 0468e662989da55bdc5e
Version: webpack 2.2.1
Time: 6730ms
                                  Asset       Size  Chunks             Chunk Names
  vendor.0b3c06ba6b2494d683ee.bundle.js     142 kB    0, 2  [emitted]  vendor
   index.d264625fd405d81cb995.bundle.js  276 bytes    1, 2  [emitted]  index
manifest.29ee4d0db8f2534cc643.bundle.js    1.44 kB       2  [emitted]  manifest
                             index.html  866 bytes          [emitted]
✨  Done in 8.21s.
```

#### HTML files

If you wish to override how HTML files are created for your Preact app, refer to the [relevant section on
neutrino-preset-web](https://neutrino.js.org/presets/neutrino-preset-web#html-files).

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

By following the [customization guide](https://neutrino.js.org/customization/advanced) and knowing the rule, loader, and plugin IDs from
neutrino-preset-web, you can override and augment the build by creating a JS module which overrides the config.

#### Vendoring

By defining an entry point named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put Preact and Preact-compat into a separate "vendor" chunk:_

```js
module.exports = neutrino => {
  neutrino.config
    .entry('vendor')
      .add('react')
      .add('react-dom');
};
```

## Hot Module Replacement

Webpack's HMR is enabled but Hot Module Replacement may/may not work at this moment. This is due to *react-hot-loader* not working with Preact and having to rely on webpack only.

---

- From your `index` entry point (defaults to `src/index.js` from `neutrino.options.entry`), Perform the application render in a reusable function for initial load and subsequent reloads.
- Add the `hot` acceptance to call this function.

For example:

```jsx
import { render } from 'preact';
import App from './App';

let root;
function init () {
  root = render(<App />, document.getElementById('root'), root);
}

init();

if (module.hot) module.hot.accept('./App', init);

```

## Contributing

Just send me a PR and try to follow my code style (semistandard).

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-preact.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-preact.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-preact