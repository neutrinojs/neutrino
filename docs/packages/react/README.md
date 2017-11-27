# Neutrino React Preset

`@neutrinojs/react` is a Neutrino preset that supports building React web applications.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Features

- Zero upfront configuration necessary to start developing and building a React web app
- Modern Babel compilation adding JSX, object rest spread syntax, and class properties.
- Support for React Hot Loader
- Write JSX in .js or .jsx files
- Automatic import of `React.createElement`, no need to import `react` or `React.createElement` yourself
- Extends from [@neutrinojs/web](../@neutrinojs/web/README.md)
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

`@neutrinojs/react` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `@neutrinojs/react` are development dependencies. You will also need React and React DOM for actual
React development.

#### Yarn

```bash
❯ yarn add --dev neutrino @neutrinojs/react
❯ yarn add react react-dom
```

#### npm

```bash
❯ npm install --save-dev neutrino @neutrinojs/react
❯ npm install --save react react-dom
```

## Project Layout

`@neutrinojs/react` follows the standard [project layout](../../project-layout.md) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to import your compiled project.

## Quickstart

After installing Neutrino and the React preset, add a new directory named `src` in the root of the project, with
a single JS file named `index.js` in it.

```bash
❯ mkdir src && touch src/index.js
```

This React preset exposes an element in the page with an ID of `root` to which you can mount your application. Edit
your `src/index.js` file with the following:

```jsx
import { render } from 'react-dom';

render(<h1>Hello world!</h1>, document.getElementById('root'));
```

Now edit your project's package.json to add commands for starting and building the application:

```json
{
  "scripts": {
    "start": "neutrino start --use @neutrinojs/react",
    "build": "neutrino build --use @neutrinojs/react"
  }
}
```

If you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: ['@neutrinojs/react']
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

`@neutrinojs/react` builds static assets to the `build` directory by default when running `neutrino build`. Using
the quick start example above as a reference:

```bash
❯ yarn build

✔ Building project completed
Hash: b26ff013b5a2d5f7b824
Version: webpack 3.5.6
Time: 9773ms
                           Asset       Size    Chunks             Chunk Names
   index.dfbad882ab3d86bfd747.js     181 kB     index  [emitted]  index
 runtime.3d9f9d2453f192a2b10f.js    1.51 kB   runtime  [emitted]  runtime
                      index.html  846 bytes            [emitted]
✨  Done in 14.62s.
```

You can either serve or deploy the contents of this `build` directory as a static site.

## Static assets

If you wish to copy files to the build directory that are not imported from application code, you can place
them in a directory within `src` called `static`. All files in this directory will be copied from `src/static`
to `build/static`. To change this behavior, specify your own patterns with
[@neutrinojs/copy](../../packages/copy/README.md).

## Paths

The `@neutrinojs/web` preset loads assets relative to the path of your application by setting Webpack's
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) to `./`. If you wish to load
assets instead from a CDN, or if you wish to change to an absolute path for your application, customize your build to
override `output.publicPath`. See the [Customizing](#Customizing) section below.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this
preset builds. You can modify React preset settings from `.neutrinorc.js` by overriding with an options object. Use
an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the React preset and override its options. See the
[Web documentation](../@neutrinojs/web#preset-options) for specific options you can override with this object.

```js
module.exports = {
  use: [
    ['@neutrinojs/react', {
      /* preset options */

      // Example: disable Hot Module Replacement
      hot: false,

      // Example: change the page title
      html: {
        title: 'Epic React App'
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

## Customizing

To override the build configuration, start with the documentation on [customization](../../customization/README.md).
`@neutrinojs/react` does not use any additional named rules, loaders, or plugins that aren't already in use by the
Web preset. See the [Web documentation customization](../@neutrinojs/web#customizing)
for preset-specific configuration to override.

### Advanced configuration

By following the [customization guide](../../customization/advanced.md) and knowing the rule, loader, and plugin IDs from
`@neutrinojs/web`, you can override and augment the build by providing a function to your `.neutrinorc.js` use
array. You can also make these changes from the Neutrino API in custom middleware.

#### Vendoring

By defining an entry point named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put React and React DOM into a separate "vendor" chunk:_

```js
module.exports = {
  use: [
    '@neutrinojs/react',
    (neutrino) => neutrino.config
      .entry('vendor')
        .add('react')
        .add('react-dom')
  ]
};
```

## Hot Module Replacement

While `@neutrinojs/react` supports Hot Module Replacement your app using React Hot Loader, it does require some
application-specific changes in order to operate.

First, install `react-hot-loader` as a dependency, this **must** be React Hot Loader v3+:

#### Yarn

```bash
❯ yarn add react-hot-loader
```

#### npm

```bash
❯ npm install --save react-hot-loader
```

---

- From your `index` entry point (defaults to `src/index.*` from `neutrino.options.entry`), import an `AppContainer`
from `react-hot-loader`. The main file may be named `index.js` or `index.jsx`. The extension is resolved by Webpack.
- Wrap your top-level React component in the `AppContainer`.
- Perform the application render in a reusable function for initial load and subsequent reloads.
- Add the `hot` acceptance to call this function.

For example:

```jsx
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import MyApp from './MyApp';

const load = () => render((
  <AppContainer>
    <MyApp />
  </AppContainer>
), document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./MyApp', load);
}

load();
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/react.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/react.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/react
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
