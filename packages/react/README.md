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
- Extends from [@neutrinojs/web](https://neutrino.js.org/packages/web)
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

`@neutrinojs/react` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to import your compiled project.

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
[@neutrinojs/copy](https://neutrino.js.org/packages/copy).

## Paths

The `@neutrinojs/web` preset loads assets relative to the path of your application by setting webpack's
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath) to `./`. If you wish to load
assets instead from a CDN, or if you wish to change to an absolute path for your application, customize your build to
override `output.publicPath`. See the [Customizing](#Customizing) section below.

For details on merging and overriding Babel configuration, such as supporting decorator syntax, read more
about using the [`compile-loader` `merge`](../compile-loader#advanced-merging) once you
are comfortable customizing your build.

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this
preset builds. You can modify React preset settings from `.neutrinorc.js` by overriding with an options object. Use
an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the React preset and override its options. See the
[Web documentation](https://neutrino.js.org/packages/web#preset-options) for specific options you can override with this object.

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

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`@neutrinojs/react` does not use any additional named rules, loaders, or plugins that aren't already in use by the
Web preset. See the [Web documentation customization](https://neutrino.js.org/packages/web#customizing)
for preset-specific configuration to override.

For details on merging and overriding Babel configuration, such as supporting decorator syntax, read more
about using the [`compile-loader` `merge`](https://neutrino.js.org/packages/compile-loader#advanced-merging) once you
are comfortable customizing your build.

### Advanced configuration

By following the [customization guide](https://neutrino.js.org/customization) and knowing the rule, loader, and plugin IDs from
`@neutrinojs/web`, you can override and augment the build by providing a function to your `.neutrinorc.js` use
array. You can also make these changes from the Neutrino API in custom middleware.

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
  use: ['@neutrinojs/react']
}
```

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

From your main entry point (defaults to `src/index.*` from `neutrino.options.mains.index`), import an `AppContainer`
from `react-hot-loader`. The main file may be named `index.js` or `index.jsx`. The extension is resolved by webpack.
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
