# Neutrino Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications
to the way your Neutrino presets are building your project. Neutrino provides a mechanism to augment presets and
middleware in the context of a project without resorting to creating and publishing an entirely independent preset.

## `.neutrinorc.js`

First, you will need to create a `.neutrinorc.js` file in the root of your project. You
[may have already done this](../usage.md#using-multiple-presets) if you specified your middleware via `.neutrinorc.js`
as opposed to CLI `--use`.

The `.neutrinorc.js` file is picked up by Neutrino automatically if it exists. This can simplify your Neutrino commands
by making them as simple as `neutrino start` or `neutrino build`. If you do all your customization within
`.neutrinorc.js`, the CLI will pick up these changes every time you run it.

### Middleware formats

Before we delve into making customizations in `.neutrinorc.js`, it's important to note that this file can be in any
valid [middleware format](../middleware#formats) that Neutrino accepts. For project-based customization, it is
recommended to use the object format, and that will be the format we focus on for the remainder of this guide. Should
you need a lot of API customization, you may still opt to write your `.neutrinorc.js` file in the function format.

Your `.neutrinorc.js` file is a JavaScript module which will be required by Neutrino using Node.js. Any code written in
this file should be usable by the version of Node.js you have running on your system when running Neutrino. The
`.neutrinorc.js` file should export an object or function depending on which format you opt to use.

```js
module.exports = {
  /* make customizations */
};
```

```js
module.exports = (neutrino) => {
  /* make customizations */
};
```

**In a nutshell, the `.neutrinorc.js` file is wholly middleware**.

## Overriding Neutrino options

Neutrino has a number of useful options for customizing its behavior, and these can be overriden by using an
object at the `options` property:

### `options.root`

Set the base directory which Neutrino middleware and presets operate on. Typically this is the project directory where
the package.json would be located. If the option is not set, Neutrino defaults it to `process.cwd()`. If a relative
path is specified, it will be resolved relative to `process.cwd()`; absolute paths will be used as-is.

```js
module.exports = {
  options: {
    // Override to relative directory, resolves to process.cwd() + website
    root: 'website',
    // Override to absolute directory
    root: '/code/website'
  }
};
```

### `options.source`

Set the directory which contains the application source code. If the option is not set, Neutrino defaults it to `src`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
module.exports = {
  options: {
    // Override to relative directory, resolves to options.root + lib
    source: 'lib',
    // Override to absolute directory
    source: '/code/website/lib'
  }
};
```

### `options.output`

Set the directory which will be the output of built assets. If the option is not set, Neutrino defaults it to `build`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
module.exports = {
  options: {
    // Override to relative directory, resolves to options.root + dist
    output: 'dist',
    // Override to absolute directory
    output: '/code/website/dist'
  }
};
```

### `options.tests`

Set the directory that contains test files. If the option is not set, Neutrino defaults it to `test`.
If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be used as-is.

```js
module.exports = {
  options: {
    // Override to relative directory, resolves to options.root + testing
    tests: 'testing',
    // Override to absolute directory
    tests: '/code/website/testing'
  }
};
```

### `options.static`

Designate a directory within `source` for containing static/non-compiled assets. If the option is not set, Neutrino
defaults it to `static`. If a relative path is specified, it will be resolved relative to `options.source`; absolute
paths will be used as-is (not recommended).

```js
module.exports = {
  options: {
    // Override to relative directory, resolves to options.source + public
    static: 'public'
  }
};
```

### `options.entry`

Set the main entry point for the application. If the option is not set, Neutrino defaults it to `index.*` - the
extension is resolved by Webpack. If a relative path is specified, it will be resolved relative to `options.source`;
absolute paths will be used as-is.

The main file by default is not required to be in JavaScript format. It also potentially may be JSX, TypeScript, or
any other preprocessor language. These extensions should be specified in middleware at
`neutrino.config.resolve.extensions`. 

```js
module.exports = {
  options: {
    // Override to relative file, resolves to options.source + entry.*
    entry: 'entry',
    
    // Override to relative file, resolves to options.source + app.js
    entry: 'app.js',
    
    // Override to absolute file
    entry: '/code/website/src/entry.js'
  }
};
```

### `options.node_modules`

Set the directory which contains the Node.js modules of the project. If the option is not set, Neutrino defaults it to
`node_modules`. If a relative path is specified, it will be resolved relative to `options.root`; absolute paths will be
used as-is.

```js
module.exports = {
  options: {
    // Override to relative directory, resolves to options.root + modules
    node_modules: 'modules',
    // Override to absolute directory
    node_modules: '/code/website/modules'
  }
};
```

## Using middleware

By specifying a `use` array in your `.neutrinorc.js`, you can inform Neutrino to load additional middleware when it
runs, including any additional files you wish to include as middleware. Each item in this `use` array can be any
Neutrino-supported [middleware format](../middleware#formats).

In its simplest form, each item can be the string module name or path to middleware you wish Neutrino to require and
use for you:

```js
module.exports = {
  use: [
    'neutrino-preset-airbnb-base',
    'neutrino-preset-react',
    'neutrino-preset-jest',
    './override.js'
  ]
};
```

If your middleware module supports its own options, instead of referencing it by string, use an array pair of string
module name and options:

```js
module.exports = {
  use: [
    ['neutrino-preset-airbnb-base', {
      eslint: {
        rules: {
          semi: 'off'
        }
      }
    }],

    ['neutrino-preset-react', {
      polyfills: { babel: false },
      html: { title: 'Epic React App' }
    }],

    'neutrino-preset-jest'
  ]
};
```

If you need to make more advanced configuration changes, you can even directly pass a function as middleware to `use`
and have access to the Neutrino API:

```js
module.exports = {
  use: [
    'neutrino-preset-airbnb-base',
    'neutrino-preset-react',
    'neutrino-preset-jest',
    (neutrino) => neutrino.config.module
      .rule('style')
      .use('css')
      .options({ modules: true })
  ]
};
```

## Environment-specific overrides

Sometimes you can only make certain configuration changes in certain Node.js environments, or you may choose to
selectively make changes based on the values of any arbitrary environment variable. These can be done from
`.neutrinorc.js` using the `env` property. Each property within `env` maps to an environment variable with key-values
mapping to  environment values which contain further middleware. This works for any environment variable, not just
`NODE_ENV`.

For example, if you wanted to include additional middleware when `NODE_ENV` is `production`:

```js
module.exports = {
  env: {
    NODE_ENV: {
      production: {
        use: ['neutrino-middleware-pwa']
      }
    }
  }
};
```

_Example: Turn on CSS modules when the environment variable `CSS_MODULES=enable`:_

```js
module.exports = {
  env: {
    CSS_MODULES: {
      // Turn on CSS modules when the environment variable CSS_MODULES=enable
      enable: (neutrino) => {
        neutrino.config.module
          .rule('style')
            .use('css')
              .options({ modules: true });
      }
    }
  }
};
```

You may use any middleware format as the value for the matching environment-value mapping.

## Advanced configuration changes

Making deep or complex changes to Neutrino build configuration beyond what middleware options afford you can be done
using the function middleware format. If you wish, your entire `.neutrinorc.js` file can be a middleware function, but
typically this function can be inlined directly as an additional item in the `use` array.

If you're familiar with middleware from the Express/connect world, this works similarly. When using Express middleware,
you provide a function to Express which receives arguments to modify a request or response along its lifecycle. There
can be a number of middleware functions that Express can load, each one potentially modifying a request or response in
succession.

When you add a middleware function to `use`, this is typically used to override Neutrino's configuration, and you can
add as many functions as you wish in succession. Every preset or middleware that Neutrino has loaded follows this same
middleware successive pipeline.

The Neutrino API instance provided to your function has a `config` property that is an instance of
[webpack-chain](https://github.com/mozilla-neutrino/webpack-chain). We won't go in-depth of all the configuration
possibilities here, but encourage you to check out the documentation for webpack-chain for instructions on your
particular use case. Just know that you can use webpack-chain to modify any part of the underlying Webpack configuration
using its API.

This `neutrino.config` is an accumulation of all configuration up to this moment. All Neutrino middleware and presets
interact with and make changes through this config, which is all available to you. For example, if you are using the
presets `neutrino-preset-react` and `neutrino-preset-karma`, any config set can be extended, manipulated, or removed.

_Example: Neutrino's React preset adds `.jsx` as a module extension. Let's remove it._

```js
module.exports = {
  use: [
    'neutrino-preset-react',
    (neutrino) => neutrino.config.resolve.extensions.delete('.jsx')
  ]
};
```

_Example: Neutrino's Node.js preset has performance hints disabled. Let's re-enable them._

```js
module.exports = {
  use: [
    'neutrino-preset-node',
    (neutrino) => neutrino.config.performance.hints(true)
  ]
};
```

Remember, middleware can also have their own custom options for making some changes easier without having to resort to
interacting with the Neutrino API; see your respective middleware for details. Again, rather than reiterate the
documentation for [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) here, please refer to its
documentation for all ways you can modify a config instance to solve your use cases.

### Conditional configuration

Some plugins and rules are only available in certain environments. For example, the Web preset only exposes a minify
plugin during production, leading to issues when trying to modify its settings, but throws an exception during
development.

_Example: Remove all arguments to the `minify` plugin when using the Web preset._

```js
config.when(process.env.NODE_ENV === 'production', config => {
  config.plugin('minify').tap(args => []);
});
```
