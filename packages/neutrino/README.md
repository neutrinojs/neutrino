<p align="center">
  <img src="https://github.com/mozilla-neutrino/neutrino/raw/logo/neutrino.png" height="150" />
</p>

<p align="center">Create and build modern JavaScript applications with zero initial configuration and minimal fuss.</p>
<p align="center"><a href="https://npmjs.org/package/neutrino"><img src="https://badge.fury.io/js/neutrino.svg"></a> <a href="https://david-dm.org/mozilla-neutrino/neutrino"><img src="https://david-dm.org/mozilla-neutrino/neutrino.svg"></a></p>
---

Neutrino is a helper tool which lets you build web and Node.js applications with shared
configurations. It intends to make the process of initializing and building projects much simpler by
providing minimal development dependencies. Neutrino uses Webpack to build both web and Node.js
projects by providing complete build presets which can be shared across targets and projects. You
can use neutrino base presets to get started building a variety of projects, create your own
presets by extending the neutrino code presets to be shared across your own projects or even by the
community. Presets can even be manipulated on a project-by-project basis to handle almost any build
situation your preset doesn't cover.

---

## Features

- Preset-based Webpack building with development and production support
- Test web projects with Karma + Mocha, and Node.js projects with Mocha

## Core Presets

- [Web](https://github.com/mozilla-neutrino/neutrino-preset-web): Build modern, generic web applications
- [Node.js](https://github.com/mozilla-neutrino/neutrino-preset-node): Build modern Node.js applications
- [React](https://github.com/mozilla-neutrino/neutrino-preset-react): Build React-based web applications

## Requirements

- v3 (latest): Node.js v4+ and yarn
- v2: Node.js v4+ and npm

## Getting started

Neutrino projects require 2 development dependencies: neutrino itself and a build configuration
preset. Neutrino provides core presets for building generic web applications, Node.js, or React
applications. If these presets do not meet your needs, feel free to use a community-provided preset
or extend one of these presets to meet your needs.

To get started using neutrino in your project, install neutrino and your preset as development
dependencies. In this example, we want to build a React application:

```sh
npm install --save-dev neutrino neutrino-preset-react
```

With neutrino and your preset in place, modify the `scripts` in your package.json to use
neutrino for building the project:

```json
{
  "scripts": {
    "start": "PORT=3000 neutrino start --preset neutrino-preset-react",
    "test": "neutrino test --preset neutrino-preset-react",
    "build": "neutrino build --preset neutrino-preset-react"
  }
}
```

By default, neutrino preset look for source code in `src/`, and tests in `test/`. Use your npm
scripts to start building!

```sh
# Build the application in development mode
yarn start

# Build the application and run any tests
yarn test

# Build the application in production mode, outputting content to build/
yarn run build
```

If you plan to use the same preset across all your script targets, you can add a `config` entry to
your package.json to specify this:

```json
{
  "config": {
    "preset": "neutrino-preset-react"
  },
  "scripts": {
    "start": "PORT=3000 neutrino start",
    "test": "neutrino test",
    "build": "neutrino build"
  }
}
```

## Overriding presets

Neutrino core presets provide a good baseline for developing a few different types of JavaScript
applications by providing configuration for Webpack, ESLint, Karma, and Mocha. If you need to modify
preset configuration, you can `require` the preset in your project and specify a new preset to
neutrino with the changes.

For example, let's say you have a project using the neutrino `web` preset, but now want to support
building LESS files. Let's create a new custom preset in your project to handle this, e.g.
`custom-preset.js`:

```js
// require the preset to change
const preset = require('neutrino-preset-web');
// also a using helper to deep-copy an object
const clone = require('lodash.clonedeep');

// Find the preset's CSS loader
const cssLoader = preset.module.loaders.find(l => /css/.test(l.test));

// Make a copy of the loader so we can use it for LESS loading, while still keeping normal
// CSS loading
const lessLoader = clone(cssLoader);

// Change the files the loader uses to .less files
lessLoader.test = /\.less$/;

// Add the less-loader to this loader which handles LESS compilation
lessLoader.loaders.push(require.resolve('less-loader'));

// Add the new LESS loader to the preset
preset.module.loaders.push(lessLoader);

// re-export the modified preset
module.exports = preset;
```

Now use your new preset in your package.json scripts:

```json
{
  "scripts": {
    "start": "neutrino start -p custom-preset.js"
  }
}
```

# Creating shareable presets

Creating neutrino presets uses the same premise as modifying a preset, but with the addition that
these can be published to npm and used in numerous projects. See the neutrino core presets for
examples on how this is accomplished for tips on creating your own presets.

## Contribute

- Issue Tracker: [https://github.com/mozilla-neutrino/neutrino/issues](https://github.com/mozilla-neutrino/neutrino/issues)
- Source Code: [https://github.com/mozilla-neutrino/neutrino](https://github.com/mozilla-neutrino/neutrino)
- Code of Conduct: [Adapted from Rust CoC](https://www.rust-lang.org/conduct.html)

## Support

If you are having issues, please let us know.

## License

This project is licensed under the [Mozilla Public License v2.0](https://github.com/mozilla-neutrino/neutrino/blob/master/LICENSE)
