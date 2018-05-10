# Creating presets

Creating Neutrino middleware and presets can solve a number of use cases in a manner which captures all the necessary configuration and dependencies necessary to accomplish those use cases:

* You find yourself needing to make the same modifications to all the projects you work on.
* Your team wants to adopt a managed set of linting rules across projects.
* You want to add functionality to the build pipeline that has not yet been encapsulated by an existing preset.
* You want to support building for more platforms than existing presets support.

## Getting Started

Neutrino middleware are Node.js modules or packages that export a [middleware format](middleware.md#formats). We call these Neutrino middleware because they sit in the middle of Neutrino and webpack, modifying a configuration with each subsequent middleware call. When using the function middleware formats, you can use the Neutrino instance provided to the middleware function to modify the configuration, provide your own configuration, expose custom options for your middleware, listen for build events, and execute custom functionality.

Neutrino presets are just Neutrino middleware that encapsulate a specific project need or the combination of other middleware. At a bare minimum, let's start by exporting a middleware function for an empty Neutrino preset:

```javascript
module.exports = neutrino => {
  // ...
};
```

If you are using Babel or Neutrino to build your preset \(very meta\) with ES modules:

```javascript
export default neutrino => {
  // ...
};
```

## Configuring

The Neutrino instance provided to your middleware function has a `config` property that is an instance of [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain). We won't go in-depth of all the configuration possibilities here, but encourage you to check out the documentation for webpack-chain for instructions on your particular use cases.

This `neutrino.config` is an accumulation of all configuration set up to this moment. All Neutrino presets and middleware interact with and make changes through this config, which is all available to your preset.

## Events

Neutrino exposes events for various stages of the build process your preset can hook into **if necessary**.

* `prestart`: Triggered before creating a development bundle, launching a dev server, or a source watcher.
* `start`: Triggered after the development bundle has been created the dev server or source watcher has started.
* `prebuild`: Triggered before creating a production build.
* `build`: Triggered after the production build has completed.
* `pretest`: Triggered before invoking any test runners.
* `test`: Triggered when test runners can start, or after they have all completed.
* `prerun`: Triggered before creating a development bundle, production build, and before invoking any test runners.
* `run`: Triggered after the development bundle, production build, or all test runners have completed.

_Example: Log to the console when a build finishes._

```javascript
module.exports = neutrino => {
  neutrino.on('build', () => console.log('whew!'));
};
```

## Including and merging other middleware

If your preset depends on other Neutrino presets and/or middleware, or you are creating a preset that is a combination of multiple presets and/or middleware, you can install them as dependencies and simply have Neutrino use them as middleware. When users install your preset, they will bring along these dependencies defined with your package without needing to to include your extended presets in their own commands.

_Example: Define a Neutrino preset which combines Node.js and Mocha presets._

```javascript
const node = require('@neutrinojs/node');
const mocha = require('@neutrinojs/mocha');

module.exports = neutrino => {
  neutrino.use(node);
  neutrino.use(mocha);

  // neutrino.config now contains the accumulation of configuration from
  // the Node.js and Mocha presets
};
```

## Sample Preset: JavaScript Standard Style

Let's create a preset from scratch which allows users to augment their project with [JavaScript Standard Style](http://standardjs.com/). For this sample preset we are using [Yarn](https://yarnpkg.com) for managing dependencies, but you may use the npm client if you desire.

**Important: this preset is not meant to be functional; rather it is used to demonstrate the concepts of creating presets.**

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

```javascript
module.exports = neutrino => {
  neutrino.config.module
    .rule('lint')
      .pre()
      .test(neutrino.regexFromExtensions(['js', 'jsx']))
      .include
        .add(neutrino.options.source)
        .end()
      .use('standard')
        .loader(require.resolve('standard-loader'))
        .options({ snazzy: false });
};
```

## Middleware Options

If you want to expose custom options for your middleware that are not appropriate to be stored in the Neutrino config, your middleware function can accept a second argument for its options. You may then document to users how they can go about affecting how your middleware works by manipulating these options via their own middleware or `.neutrinorc.js`. You can then merge these options back with your defaults within your middleware when needed.

_Example:_

```javascript
module.exports = (neutrino, opts = {}) => {
  const options = {
    quiet: false,
    logLevel: 'warn',
    ...opts
  };

  // ...
};
```

## Working with paths

When working with paths, remember that your preset will be running in the context of a project. You should take care to define application paths by referencing the current working directory with `process.cwd()`. For example, if you wanted to interact with a file with a project, you would merge the path via `path.join(process.cwd(), 'project.file')`.

Neutrino provides a number of paths that have been defaulted through `neutrino.options` or configured by the user. Please consider using these paths for your preset so they play nice with others.

### Modifying Neutrino options

If you wish to **modify** Neutrino options, including paths, it is recommended to use the object middleware format so Neutrino can guarantee options are merged prior to your middleware being used.

```javascript
const middleware = (neutrino, options) => {
  // ...
};

module.exports = {
  options: {
    source: 'lib',
    mains: {
      index: 'application.js'
    }
  },
  use: [middleware]
}
```

### `options.root`

Set the base directory which Neutrino middleware and presets operate on. Typically this is the project directory where the package.json would be located. If the option is not set, Neutrino defaults it to `process.cwd()`. If a relative path is specified, it will be resolved relative to `process.cwd()`; absolute paths will be used as-is.

```javascript
module.exports = neutrino => {
  // if not specified, defaults to process.cwd()
  neutrino.options.root;
};

module.exports = {
  options: {
    // relative, resolves to process.cwd() + website
    root: 'website',
    // absolute
    root: '/code/website'
  }
};
```

### `options.source`

Set the directory which contains the application source code. If the option is not set, Neutrino defaults it to `src`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```javascript
module.exports = neutrino => {
  // if not specified, defaults to options.root + src
  neutrino.options.source;
};

module.exports = {
  options: {
    // relative, resolves to options.root + lib
    source: 'lib',
    // absolute
    source: '/code/website/lib'
  }
};
```

### `options.output`

Set the directory which will be the output of built assets. If the option is not set, Neutrino defaults it to `build`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```javascript
module.exports = neutrino => {
  // if not specified, defaults to options.root + build
  neutrino.options.output;
}

module.exports = {
  options: {
    // relative, resolves to options.root + dist
    output: 'dist',
    // absolute
    output: '/code/website/dist'
  }
};
```

### `options.tests`

Set the directory that contains test files. If the option is not set, Neutrino defaults it to `test`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```javascript
module.exports = neutrino => {
  // if not specified, defaults to options.root + test
  neutrino.options.tests;
};

module.exports = {
  options: {
    // relative, resolves to options.root + testing
    tests: 'testing',

    // absolute
    tests: '/code/website/testing'
  }
};
```

### `options.mains`

Set the main entry points for the application. If the option is not set, Neutrino defaults it to:

```javascript
{
  index: 'index'
}
```

Notice the entry point has no extension; the extension is resolved by webpack. If relative paths are specified, they will be computed and resolved relative to `options.source`; absolute paths will be used as-is.

By default these main files are not required to be in JavaScript format. They may also potentially be JSX, TypeScript, or any other preprocessor language. These extensions should be specified in middleware at `neutrino.config.resolve.extensions`.

```javascript
module.exports = neutrino => {
  // if not specified, defaults to an object with a single entry "index",
  // resolved to options.source + index
  neutrino.options.mains.index;
};

module.exports = {
  options: {
    mains: {
      // If not specified, defaults to options.source + index
      index: 'index',

      // Override to relative, resolves to options.source + entry.*
      index: 'entry',

      // Override to absolute path
      index: '/code/website/src/entry.js',

      // Add additional main, resolves to options.source + admin.*
      admin: 'admin'
    }
  }
};
```

### `options.node_modules`

Set the directory which contains the Node.js modules of the project. If the option is not set, Neutrino defaults it to `node_modules`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```javascript
module.exports = neutrino => {
  // if not specified, defaults to options.root + node_modules
  neutrino.options.node_modules;
};

module.exports = {
  options: {
    // relative, resolves to options.root + modules
    node_modules: 'modules',
    // absolute
    node_modules: '/code/website/modules'
  }
};
```

### `options.extensions`

Set the preferred list of module extensions to inform interested middleware. If the option is not set, Neutrino defaults it to `['js', 'jsx', 'vue', 'ts', 'tsx', 'mjs']`.

```javascript
module.exports = neutrino => {
  // if not specified, defaults to ['js', 'jsx', 'vue', 'ts', 'tsx', 'mjs']
  neutrino.options.extensions;

  // overwrites the default list
  neutrino.options.extensions = ['elm']
}

module.exports = {
  options: {
    // extends the default list to ['js', 'jsx', 'vue', 'ts', 'tsx', 'mjs', 'elm']
    extensions: ['elm']
  }
};
```

## Loader and Babel modules

Because of package conflicts or unknown layout of a project's `node_modules` directory, it is usually safer to define loaders, Babel plugins, and Babel presets to webpack absolutely than by name. In our sample preset above, while we could have passed the loader as just `'standard-loader'`, it is safer to resolve its location relative to our preset than having webpack et al attempt to load it later from a different, potentially incorrect location. Instead we passed `require.resolve('standard-loader')`.

As a rule of thumb, if your preset is the one using `require`, you are safe to require by name. If you are passing the name of the module off to be required by webpack or Babel, instead pass the path to the module via `require.resolve`.

## Publishing

When your preset is ready to be used by others, feel free to publish and distribute! By putting your preset on npm, GitHub, or another location, you can share the hard work put into abstracting away configuration and save everyone in the community time and effort. As long as the Neutrino CLI or another preset can require your preset, it puts no restrictions on where you want to host it.

