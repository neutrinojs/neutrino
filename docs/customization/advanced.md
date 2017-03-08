# Advanced Neutrino Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications
to the way your Neutrino preset is building your project. If you need more customization than can be afforded by
augmenting your project's package.json, consider using this advanced configuration guide to modify your build as
needed.

## Creating a project-specific override

Neutrino configurations are backed by [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain), a library for
making modifications to a Webpack configuration using a fluent or chained API. When your project needs more advanced
build overrides, you will be interacting with this API in order to perform modifications.

First, we need to create a project-specific override to make these changes. This can either be a JS file or a directory
with an `index.js` file. Since Neutrino uses Node.js and Webpack for interacting with presets, it is helpful to
understand that this is a Node.js module. By exporting a middleware function from your module, you will be provided with
a Neutrino instance for modifying the build. Let's create a file called `override.js` in the root of our example
project:

```js
// override.js
module.exports = neutrino => {
  // ...
};
```

The signature of this function is what we call "Neutrino middleware". If you're familiar with middleware from the
Express/connect world, this works similarly. When using Express middleware, you provide a function to Express which
receives arguments to modify a request or response along its lifecycle. There can be a number of middleware functions
that Express can load, each one potentially modifying a request or response in succession.

When you customize Neutrino with an override, you export a Neutrino middleware function, except this is typically used
to override Neutrino's configuration. Every preset or middleware that Neutrino has loaded follows this same middleware
pipeline.

At the moment our custom override isn't doing anything, but it does get us far enough to be able to tell Neutrino
to use it for additional configuration. Modify your package.json and add `override.js` as an additional preset.

_Note: Neutrino will attempt to load this module relative to the current working directory, which should be the root of
your project._

```json
{
  "config": {
    "presets": [
      "neutrino-preset-react",
      "neutrino-preset-karma",
      "override.js"
    ]  
  },
  "scripts": {
    "build": "neutrino build"
  }
}
```

Other than actually changing the build configuration or Neutrino options, that is all the setup necessary for Neutrino
to pick up your custom changes.

## Overriding Neutrino options

Neutrino has a number of useful options for customizing its behavior, as well as the behavior of presets and middleware.
You can override these options using an object at `neutrino.options`.

**Important! Some of these options are used by presets and middleware to determine their path locations for building.
Making changes to these in advanced configuration will usually mean needing to set Neutrino options before other presets
are loaded, and overriding build configuration after the presets have loaded. Consider using
[simple customization](./simple.md) for setting Neutrino options and preset/middleware-specific options.**

### `options.root`

Set the base directory which Neutrino middleware and presets operate on. Typically this is the project directory where
the package.json would be located. If the option is not set, Neutrino defaults it to `process.cwd()`. If a relative
path is specified, it will be resolved relative to `process.cwd()`; absolute paths will be used as-is.

```js
module.exports = neutrino => {
  // if not specified, defaults to process.cwd()
  neutrino.options.root;
  
  // relative, resolves to process.cwd() + ./website
  neutrino.options.root = './website';
  
  // absolute
  neutrino.options.root = '/code/website';
};
```

### `options.source`

Set the directory which contains the application source code. If the option is not set, Neutrino defaults it to `src`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
module.exports = neutrino => {
  // if not specified, defaults to options.root + src
  neutrino.options.source;
  
  // relative, resolves to options.root + ./lib
  neutrino.options.source = './lib';
  
  // absolute
  neutrino.options.source = '/code/website/lib';
};
```

### `options.output`

Set the directory which will be the output of built assets. If the option is not set, Neutrino defaults it to `build`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
module.exports = neutrino => {
  // if not specified, defaults to options.root + build
  neutrino.options.output;
  
  // relative, resolves to options.root + ./dist
  neutrino.options.output = './dist';
  
  // absolute
  neutrino.options.output = '/code/website/dist';
};
```

### `options.tests`

Set the directory that contains test files. If the option is not set, Neutrino defaults it to `test`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
module.exports = neutrino => {
  // if not specified, defaults to options.root + test
  neutrino.options.tests;
  
  // relative, resolves to options.root + ./testing
  neutrino.options.tests = './testing';
  
  // absolute
  neutrino.options.tests = '/code/website/testing';
};
```

### `options.entry`

Set the main entry point for the application. If the option is not set, Neutrino defaults it to `index.js`.
If a relative path is specified, it will be resolved relative to `options.source`; absolute paths will be used as-is.

```js
module.exports = neutrino => {
  // if not specified, defaults to options.source + index.js
  neutrino.options.entry;
  
  // relative, resolves to options.source + ./entry.js
  neutrino.options.entry = './entry.js';
  
  // absolute
  neutrino.options.entry = '/code/website/lib/entry.js';
};
```

### `options.node_modules`

Set the directory which contains the Node.js modules of the project. If the option is not set, Neutrino defaults it to
`node_modules`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be
used as-is.

```js
module.exports = neutrino => {
  // if not specified, defaults to options.root + node_modules
  neutrino.options.node_modules;
  
  // relative, resolves to options.root + ./modules
  neutrino.options.node_modules = './modules';
  
  // absolute
  neutrino.options.node_modules = '/code/website/modules';
};
```

### Middleware or preset options

Some middleware and presets also have their own custom options. Consult the documentation for the package for specific
details on its customization.

## Overriding build configuration

The Neutrino instance provided to your custom configurator has a `config` property that is an instance of
[webpack-chain](https://github.com/mozilla-neutrino/webpack-chain). We won't go in-depth of all the configuration
possibilities here, but encourage you to check out the documentation for webpack-chain for instruction on your
particular use case. Just know that you can use webpack-chain to modify any part of the underlying Webpack configuration
using its API.

This `neutrino.config` is an accumulation of all configuration up to this moment. All Neutrino middleware and presets
interact with and make changes through this config, which is all available to you. For example, if you are using the
presets `neutrino-preset-react` and `neutrino-preset-karma`, any config set can be extended, manipulated, or removed.

_Example: Neutrino's React preset adds `.jsx` as a module extension. Let's remove it._

```js
module.exports = neutrino => {
  neutrino.config.resolve.extensions.delete('.jsx');
};
```

_Example: Neutrino's Node.js preset uses `babel-preset-env` to support Node.js v6.9. Let's change it to support back to
v4.2. This preset has a rule named "compile" and a loader named "babel"._

```js
module.exports = neutrino => {
  neutrino.config.module
    .rule('compile')
    .loader('babel', options => {
      options.presets[0][1].targets.node = 4.2;
      
      return options;
    });
};
```

Presets can also have their own custom data in addition to the Neutrino config. See your respective preset for details.
Again, rather than reiterate the documentation for [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain)
here, please refer to its documentation for all ways you can modify a config instance to solve your use cases.
