# Neutrino Node.js Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-node` is a Neutrino preset that supports building Node.js applications.

## Features

- Zero upfront configuration necessary to start developing and building a Node.js project
- Modern Babel compilation supporting ES modules, Node.js 6.9+, async functions, and dynamic imports
- Supports automatically-wired sourcemaps
- Tree-shaking to create smaller bundles
- Hot Module Replacement with source-watching during development
- Chunking of external dependencies apart from application code
- Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-preset-node` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-node` are development dependencies.

#### Yarn

```bash
❯ yarn add --dev neutrino neutrino-preset-node
```

#### npm

```bash
❯ npm install --save-dev neutrino neutrino-preset-node
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

`neutrino-preset-node` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files that would be available to your compiled project.

## Quickstart

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
    "start": "neutrino start --use neutrino-preset-node",
    "build": "neutrino build --use neutrino-preset-node"
  }
}
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

`neutrino-preset-node` builds assets to the `build` directory by default when running `neutrino build`. Using the
quick start example above as a reference:

```bash
❯ yarn build
clean-webpack-plugin: /node/build has been removed.
Build completed in 0.419s

Hash: 89e4fb250fc535920ba4
Version: webpack 2.2.1
Time: 424ms
       Asset     Size  Chunks             Chunk Names
    index.js  4.29 kB       0  [emitted]  index
index.js.map  3.73 kB       0  [emitted]  index
✨  Done in 1.51s.
```

You can either serve or deploy the contents of this `build` directory as a Node.js module, server, or tool. For Node.js
this usually means adding a `main` property to package.json pointing to the built entry point. Also when publishing your
project to npm, consider excluding your `src` directory by using the `files` property to whitelist `build`,
or via `.npmignore` to blacklist `src`.

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

While `neutrino-preset-node` supports Hot Module Replacement for your app, it does require some application-specific
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
This can be done from the [API](../../api#optionsdebug) or the [CLI using `--debug`](../../cli#-debug).

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-node` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

By default the Node.js preset creates a single **main** `index` entry point to your application, and this maps to the
`index.js` file in the `src` directory. This means that the Node.js preset is optimized toward a main entry to your app.
Code not imported in the hierarchy of the `index` entry will not be output to the bundle. To overcome this you
must either define more entry points, or import the code path somewhere along the `index` hierarchy.

### Vendoring

This preset automatically vendors all external dependencies into a separate chunk based on their inclusion in your
package.json. No extra work is required to make this work.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `compile`: Compiles JS files from the `src` directory using Babel. Contains a single loader named `babel`.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `banner`: Injects source-map-support into the entry point of your application if detected in `dependencies` or
`devDependencies` of your package.json.
- `copy`: Copies non-JS files from `src` to `build` when using `neutrino build`.
- `clean`: Clears the contents of `build` prior to creating a production bundle.

### Simple customization

By following the [customization guide](https://neutrino.js.org/customization/simple) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build directly from package.json.

#### Compile targets

This preset uses babel-preset-env to compile code targeting the Node.js v6.9+. To change
the Node.js target from package.json, specify an object at `neutrino.options.compile.targets` which contains a
[babel-preset-env-compatible](https://github.com/babel/babel-preset-env#targetsnode) Node.js target.

_Example: Replace the preset Node.js target with support for Node.js 4.2:_

```json
{
  "neutrino": {
    "options": {
      "compile": {
        "targets": {
          "node": 4.2
        }
      }
    }
  }
}
```

_Example: Change support to current Node.js version:_

```json
{
  "neutrino": {
    "options": {
      "compile": {
        "targets": {
          "node": "current"
        }
      }
    }
  }
}
```

#### Other customization examples

_Example: Allow importing modules with an `.mjs` extension._

```json
{
  "neutrino": {
    "config": {
      "resolve": {
        "extensions": [
          ".mjs"
        ]
      }
    }
  }
}
```

### Advanced configuration

By following the [customization guide](https://neutrino.js.org/customization/advanced) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by creating a JS module which overrides the config.

#### Compile targets

This preset uses babel-preset-env to compile code targeting the Node.js v6.9+. To change
the Node.js target from package.json, specify an object at `neutrino.options.compile.targets` which contains a
[babel-preset-env-compatible](https://github.com/babel/babel-preset-env#targetsnode) Node.js target.

**Note: Setting these options via `neutrino.options.compile` must be done prior to loading the Node.js preset or they
will not be picked up by the compile middleware. These examples show changing compile targets with options before
loading the preset and overriding them if loaded afterwards.**

_Example: Replace the preset Node.js target with support for Node.js 4.2:_

```js
module.exports = neutrino => {
  // Using neutrino.options prior to loading Node.js preset
  neutrino.options.compile = {
    targets: {
      node: 4.2
    }
  };

  // Using compile options override following loading Node.js preset
  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(options => {
      options.presets[0][1].targets.node = 4.2;

      return options;
    });
};
```

_Example: Change support to current Node.js version:_

```js
module.exports = neutrino => {
  // Using neutrino.options prior to loading Node.js preset
  neutrino.options.compile = {
    targets: {
      node: 4.2
    }
  };

  // Using compile options override following loading Node.js preset
  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(options => {
      options.presets[0][1].targets.node = 'current';

      return options;
    });
};
```

#### Other customization examples

_Example: Allow importing modules with an `.mjs` extension._

```js
module.exports = neutrino => {
  neutrino.config.resolve.extensions.add('.mjs');
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-node.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-node.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-node
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
