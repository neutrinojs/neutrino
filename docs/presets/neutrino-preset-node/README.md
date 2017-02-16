# Neutrino Node.js Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-node` is a Neutrino preset that supports building Node.js applications.

## Features

- Zero upfront configuration necessary to start developing and building a Node.js project
- Modern Babel compilation supporting ES modules, Node.js 6.9+, and async functions
- Auto-wired sourcemaps
- Chunking of external dependencies apart from application code
- Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v4

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

## Project Layout

`neutrino-preset-node` follows the standard [project layout](/project-layout.md) specified by Neutrino. This
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

**Important Note:** At the time of writing, Neutrino's Node preset does not support `watch`
compilation with `neutrino start`; it will instead fall back to running a build with the `NODE_ENV`
environment variable set to `development`.

```json
{
  "scripts": {
    "start": "neutrino start --presets neutrino-preset-node && node build/index.js",
    "build": "neutrino build --presets neutrino-preset-node"
  }
}
```

Start the app, then either open a browser to http://localhost:3000 or use curl from another terminal window:

#### Yarn

```bash
❯ yarn start
Warning: This preset does not support watch compilation. Falling back to a one-time build.
Hash: 89e4fb250fc535920ba4
Version: webpack 2.2.1
Time: 432ms
       Asset     Size  Chunks             Chunk Names
    index.js  4.29 kB       0  [emitted]  index
index.js.map  3.73 kB       0  [emitted]  index
Server running on port 3000
```

```bash
❯ curl http://localhost:3000
hi!
```

#### npm

```bash
❯ npm start
Warning: This preset does not support watch compilation. Falling back to a one-time build.
Hash: 89e4fb250fc535920ba4
Version: webpack 2.2.1
Time: 432ms
       Asset     Size  Chunks             Chunk Names
    index.js  4.29 kB       0  [emitted]  index
index.js.map  3.73 kB       0  [emitted]  index
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

## Customizing

To override the build configuration, start with the documentation on [customization](/customization/README.md).
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

- `banner`: Injects source-map-support into the entry point of your application.
- `copy`: Copies non-JS files from `src` to `build` when using `neutrino build`.
- `clean`: Clears the contents of `build` prior to creating a production bundle.
- `progress`: Displays a progress bar when using `neutrino build`.

### Simple customization

By following the [customization guide](/customization/simple.md) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build directly from package.json.

_Example: Allow importing modules with an `.mjs` extension._

```json
{
  "config": {
    "neutrino": {
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

By following the [customization guide](/customization/advanced.md) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by creating a JS module which overrides the config.

_Example: Allow importing modules with an `.mjs` extension._

```js
module.exports = neutrino => {
  neutrino.config.resolve.extensions.add('.mjs');
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets. Follow the
[contributing guide](/contributing/README.md) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-node.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-node.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-node
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
