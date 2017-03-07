# Creating Neutrino Presets

Creating Neutrino presets can solve a number of use cases in a manner which captures all the necessary configuration
and dependencies necessary to accomplish those use cases:

- You find yourself needing to make the same modifications to all the projects you work on.
- Your team wants to adopt a managed set of linting rules across projects.
- You want to add functionality to the build pipeline that has not yet been encapsulated by an existing preset.
- You want to support building for more platforms than existing presets support.

## Getting Started

Neutrino presets are Node.js modules or packages that export a function which accepts a Neutrino instance. We call these
functions "Neutrino middleware", as they sit between the middle of Neutrino and Webpack, modifying a configuration with
each subsequent middleware call. You can use the Neutrino instance provided to the middleware function to modify
the configuration, provide your own configuration, expose custom options for your preset, listen for build
events, and execute functionality.

Neutrino presets are just Neutrino middleware that encapsulate a specific project need. At a bare minimum, let's start
by exporting a middleware function for an empty Neutrino preset:

```js
module.exports = neutrino => {
  // ...
};
```

If you are using Babel or Neutrino to build your preset (very meta) with ES modules:

```js
export default neutrino => {
  // ...
};
```

## Configuring

The Neutrino instance provided to your middleware function has a `config` property that is an instance of
[webpack-chain](https://github.com/mozilla-neutrino/webpack-chain). We won't go in-depth of all the configuration
possibilities here, but encourage you to check out the documentation for webpack-chain for instructions on your
particular use cases.

This `neutrino.config` is an accumulation of all configuration set up to this moment. All Neutrino presets and
middleware interacts with and makes changes through this config, which is all available to your preset.

## Events

Neutrino exposes events for various stages of the build process your preset can hook into **if necessary**.

- `prestart`: Triggered before creating a development bundle or launching a dev server.
- `start`: Triggered after the development bundle has finished or the dev server has been stopped.
- `prebuild`: Triggered before creating a production build.
- `build`: Triggered after the production build has completed.
- `pretest`: Triggered before invoking any test runners.
- `test`: Triggered when test runners can start, or after they have all completed.

_Example: Log to the console when a build finishes._

```js
module.exports = neutrino => {
  neutrino.on('build', () => console.log('whew!'));
};
```

## Including and merging other presets

If your preset depends on other Neutrino presets and/or middleware, or you are creating a preset that is a combination
of multiple presets and/or middleware, you can install them as dependencies and simply have Neutrino use them as
middleware. When users install your preset, they will bring along these dependencies defined with your package without
needing to to include your extended presets in their own commands.

_Example: Define a Neutrino preset which combines Node.js and Mocha presets._

```js
const node = require('neutrino-preset-node');
const mocha = require('neutrino-preset-mocha');

module.exports = neutrino => {
  neutrino.use(node);
  neutrino.use(mocha);
  
  // neutrino.config now contains the accumulation of configuration from
  // the Node.js and Mocha presets
};
```

## Sample Preset: JavaScript Standard Style

Let's create a preset from scratch which allows users to augment their project with
[JavaScript Standard Style](http://standardjs.com/). For this sample preset we are using
[Yarn](https://yarnpkg.com) for managing dependencies, but you may use the npm client if you desire.

**Important: this preset is not meant to be functional; rather it is used to demonstrate the concepts of creating
presets.**

```bash
# Create a new directory for your project and change into it:
mkdir neutrino-preset-standard-style && cd neutrino-preset-standard-style

# Initialize your project with a package.json:
yarn init --yes

# Install the dependencies needed by our preset
yarn add standard-loader standard

# Create the main file to the preset, e.g. index.js
touch index.js
```

Let's edit this `index.js` file to add our preset:

```js
const path = require('path');

module.exports = neutrino => {
  neutrino.config.module
    .rule('lint')
      .pre()
      .test(/\.jsx?$/)
      .include(path.join(process.cwd(), 'src'))
      .loader('standard', require.resolve('standard-loader'), {
        snazzy: false
      });
};
```

## Custom Data

If you want to expose custom options for your preset that are not appropriate to be stored in the Neutrino config,
there is a `neutrino.options` object namespace you can attach to. This way you can document to others how they can
go about affecting how your preset works. In addition, you may also instruct users of your preset to override these
options in either their package.json at `neutrino.options` or using `neutrino.options` in their advanced overrides.
You can then merge these options back with your defaults at `neutrino.options` when needed.

_Example:_

```js
module.exports = neutrino => { 
  neutrino.options.standardStyle = Object.assign({
    quiet: false,
    logLevel: 'warn'
  }, neutrino.options.standardStyle);
  
  // ...
};
```

## Working with paths

When working with paths, remember that your preset will be running in the context of a project. You should take care
to define application paths by referencing the current working directory with `process.cwd()`. For example, if you
wanted to work with the project's "src" directory, you would merge the path via `path.join(process.cwd(), 'src')`.

## Loader and Babel modules

Because of package conflicts or unknown layout of a project's `node_modules` directory, it is usually safer to
define loaders, Babel plugins, and Babel presets to Webpack absolutely than by name. In our sample preset above, while
we could have passed the loader as just `'standard-loader'`, it is safer to resolve its location relative to our preset
than having Webpack et al to attempt to load it later from a different, potentially incorrect location. Instead we
passed `require.resolve('standard-loader')`.

As a rule of thumb, if your preset is the one using `require`, you are safe to require by name. If you are passing the
name of the module off to be required by Webpack or Babel, instead pass the path to the module via `require.resolve`.

## Publishing

When your preset is ready to be used by others, feel free to publish and distribute! By putting your preset on npm,
GitHub, or another location, you can share the hard work put into abstracting away configuration and save everyone
in the community time and effort. As long as the Neutrino CLI or another preset can require your preset, it puts no
restrictions on where you want to host it.
