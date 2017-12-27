# Neutrino Node.js Preset

`@neutrinojs/node` is a Neutrino preset that supports building Node.js applications.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Features

- Zero upfront configuration necessary to start developing and building a Node.js project
- Modern Babel compilation supporting ES modules, Node.js 6.10+, async functions, and dynamic imports
- Supports automatically-wired sourcemaps
- Tree-shaking to create smaller bundles
- Hot Module Replacement with source-watching during development
- Chunking of external dependencies apart from application code
- Easily extensible to customize your project as needed

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/node` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `@neutrinojs/node` are development dependencies.

#### Yarn

```bash
❯ yarn add --dev neutrino @neutrinojs/node
```

#### npm

```bash
❯ npm install --save-dev neutrino @neutrinojs/node
```

If you want to have automatically wired sourcemaps added to your project, add `source-map-support`:

#### Yarn

```bash
❯ yarn add source-map-support
```

#### npm

```bash
❯ npm install --save source-map-support
```

## Project Layout

`@neutrinojs/node` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files that would be available to your compiled project.

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

After installing Neutrino and the Node.js preset, add a new directory named `src` in the root of the project, with
a single JS file named `index.js` in it.

```bash
❯ mkdir src && touch src/index.js
```

Edit your `src/index.js` file with the following:

```js
import { createServer } from 'http';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const port = process.env.PORT || 3000;

createServer(async (req, res) => {
  await delay(500);
  console.log('Request!');
  res.end('hi!');
})
.listen(port, () => console.log(`Server running on port ${port}`));
```

Now edit your project's package.json to add commands for starting and building the application.

```json
{
  "scripts": {
    "start": "neutrino start --use @neutrinojs/node",
    "build": "neutrino build --use @neutrinojs/node"
  }
}
```

If you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: ['@neutrinojs/node']
};
```

Start the app, then either open a browser to http://localhost:3000 or use curl from another terminal window:

#### Yarn

```bash
❯ yarn start
Server running on port 3000
```

```bash
❯ curl http://localhost:3000
hi!
```

#### npm

```bash
❯ npm start
Server running on port 3000
```

```bash
❯ curl http://localhost:3000
hi!
```

## Building

`@neutrinojs/node` builds assets to the `build` directory by default when running `neutrino build`. Using the
quick start example above as a reference:

```bash
❯ yarn build

Hash: 89e4fb250fc535920ba4
Version: webpack 3.5.6
Time: 424ms
       Asset     Size  Chunks             Chunk Names
    index.js  4.29 kB       0  [emitted]  index
index.js.map  3.73 kB       0  [emitted]  index
✨  Done in 1.51s.
```

You can either serve or deploy the contents of this `build` directory as a Node.js module, server, or tool. For Node.js
this usually means adding a `main` property to package.json pointing to the primary main built entry point. Also when
publishing your project to npm, consider excluding your `src` directory by using the `files` property to whitelist
`build`, or via `.npmignore` to blacklist `src`.

```json
{
  "main": "build/index.js",
  "files": [
    "build"
  ]
}
```

_Note: While this preset works well for many types of Node.js applications, it's important to make the distinction
between applications and libraries. This preset will not work optimally out of the box for creating distributable
libraries, and will take a little extra customization to make them suitable for that purpose._

## Hot Module Replacement

While `@neutrinojs/node` supports Hot Module Replacement for your app, it does require some application-specific
changes in order to operate. Your application should define split points for which to accept modules to reload using
`module.hot`:

For example:

```js
import { createServer } from 'http';
import app from './app';

if (module.hot) {
  module.hot.accept('./app');
}

createServer((req, res) => {
  res.end(app('example'));  
}).listen(/* */);
```

Or for all paths:

```js
import { createServer } from 'http';
import app from './app';

if (module.hot) {
  module.hot.accept();
}

createServer((req, res) => {
  res.end(app('example'));  
}).listen(/* */);
```

Using dynamic imports with `import()` will automatically create split points and hot replace those modules upon
modification during development.

## Debugging

You can start the Node.js server in `inspect` mode to debug the process by setting `neutrino.options.debug` to `true`.
This can be done from the [API](https://neutrino.js.org/api#optionsdebug) or the [CLI using `--debug`](https://neutrino.js.org/cli#-debug).

## Preset options

You can provide custom options and have them merged with this preset's default options to easily affect how this
preset builds. You can modify Node.js preset settings from `.neutrinorc.js` by overriding with an options object. Use
an array pair instead of a string to supply these options in `.neutrinorc.js`.

The following shows how you can pass an options object to the Node.js preset and override its options, showing the
defaults:

```js
module.exports = {
  use: [
    ['@neutrinojs/node', {
      // Enables Hot Module Replacement. Set to false to disable
      hot: true,

      polyfills: {
        // Enables fast-async polyfill. Set to false to disable
        async: true
      },

      // Target specific versions via babel-preset-env
      targets: {
        node: '6.10'
      },

      // Remove the contents of the output directory prior to building.
      // Set to false to disable cleaning this directory
      clean: {
        paths: [neutrino.options.output]
      },

      // Add additional Babel plugins, presets, or env options
      babel: {
        // Override options for babel-preset-env, showing defaults:
        presets: [
          ['babel-preset-env', {
            targets: { node: '6.10' },
            modules: false,
            useBuiltIns: true,
            // These are excluded when using polyfills.async. Disabling the async polyfill
            // will remove these from the exclusion list
            exclude: ['transform-regenerator', 'transform-async-to-generator']
          }]
        ]
      }
    }]
  ]
};
```

_Example: Override the Node.js Babel compilation target to Node.js v8:_

```js
module.exports = {
  use: [
    ['@neutrinojs/node', {
      // Add additional Babel plugins, presets, or env options
      babel: {
        // Override options for babel-preset-env
        presets: [
          ['babel-preset-env', {
            // Passing in targets to babel-preset-env will replace them
            // instead of merging them
            targets: {
              node: '8.0'
            }
          }]
        ]
      }
    }]
  ]
};
```

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`@neutrinojs/node` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

By default Neutrino, and therefore this preset, creates a single **main** `index` entry point to your application, and this
maps to the `index.*` file in the `src` directory. This means that this preset is optimized toward a single main entry
to your application. Code not imported in the hierarchy of the `index` entry will not be output to the bundle. To overcome
this you must either define more mains via [`options.mains`](https://neutrino.js.org/customization#optionsmains), import
the code path somewhere along the `index` hierarchy, or define multiple configurations in your `.neutrinorc.js`.

### Vendoring

This preset automatically vendors all external dependencies into a separate chunk based on their inclusion in your
package.json. No extra work is required to make this work.

### Rules

The following is a list of rules and their identifiers which can be overridden:

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `compile` | Compiles JS files from the `src` directory using Babel. Contains a single loader named `babel` | all |

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

_Note: Some plugins are only available in certain environments. To override them, they should be modified conditionally._

| Name | Description | Environments and Commands |
| --- | --- | --- |
| `banner` | Injects source-map-support into the mains (entry points) of your application if detected in `dependencies` or `devDependencies` of your package.json. | Only when `source-map-support` is installed |
| `copy` | Copies all files from `src/static` to `build` when using `neutrino build`. | `build` command |
| `clean` | Clears the contents of `build` prior to creating a production bundle. | `build` command |
| `start-server` | Start a Node.js for the first configured main entry point. | `start` command |
| `hot` | Enables Hot Module Replacement. | `start` command |
| `named-modules` | Enables named modules for improved debugging and console output. From `@neutrinojs/hot`. | `start` command |
| `module-concat` | Concatenate the scope of all your modules into one closure and allow for your code to have a faster execution time in the browser. | `NODE_ENV production` |

### Override configuration

By following the [customization guide](https://neutrino.js.org/customization) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by by providing a function to your `.neutrinorc.js` use array. You can also
make these changes from the Neutrino API in custom middleware.

_Example: Allow importing modules with a `.esm` extension._

```js
module.exports = {
  use: [
    '@neutrinojs/node',
    (neutrino) => neutrino.config.resolve.extensions.add('.esm')
  ]
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/node.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/node.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/node
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
