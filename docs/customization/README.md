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
valid [middleware format](../middleware/README.md#formats) that Neutrino accepts. For project-based customization, it is
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

### `options.mains`

Set the main entry points for the application. If the option is not set, Neutrino defaults it to:

```js
{
  index: 'index'
}
```

Notice the entry point has no extension; the extension is resolved by webpack. If relative paths are specified,
they will be computed and resolved relative to `options.source`; absolute paths will be used as-is.

```js
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

## Mutating `neutrino.options`

While it is possible to mutate `neutrino.options` directly, this should be avoided.
Instead, it is _always recommended_ to pass an `options` object to ensure proper normalization.

```js
// Bad: Using function format, overriding `neutrino.options` properites.
// Paths will not be relative to `neutrino.options.root` as expected.
module.exports = neutrino => {
  Object.assign(neutrino.options, {
    source: 'lib',
    output: 'dist'
  });
}
```

```js
// Good: Using function format, setting `neutrino.options.*` properties directly.
module.exports = neutrino => {
  neutrino.options.source = 'lib';
  neutrino.options.output = 'dist';
}
```

```js
// Good: Use object format w/ `use` array
module.exports = {
  options: {
    source: 'lib',
    output: 'dist'
  },
  use: [/* ... */]
}
```

```js
// Good: Use object format w/ `use` function
module.exports = {
  options: {
    source: 'lib',
    output: 'dist'
  },
  use: neutrino => {
    neutrino.use(/* ... */);
  }
}
```

## Using middleware

By specifying a `use` array in your `.neutrinorc.js`, you can inform Neutrino to load additional middleware when it
runs, including any additional files you wish to include as middleware. Each item in this `use` array can be any
Neutrino-supported [middleware format](../middleware/README.md#formats).

In its simplest form, each item can be the string module name or path to middleware you wish Neutrino to require and
use for you:

```js
module.exports = {
  use: [
    '@neutrinojs/airbnb-base',
    '@neutrinojs/react',
    '@neutrinojs/jest',
    './override.js'
  ]
};
```

If your middleware module supports its own options, instead of referencing it by string, use an array pair of string
module name and options:

```js
module.exports = {
  use: [
    ['@neutrinojs/airbnb-base', {
      eslint: {
        rules: {
          semi: 'off'
        }
      }
    }],

    ['@neutrinojs/react', {
      polyfills: { async: false },
      html: { title: 'Epic React App' }
    }],

    '@neutrinojs/jest'
  ]
};
```

If you need to make more advanced configuration changes, you can even directly pass a function as middleware to `use`
and have access to the Neutrino API:

```js
module.exports = {
  use: [
    '@neutrinojs/airbnb-base',
    '@neutrinojs/react',
    '@neutrinojs/jest',
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
        use: ['@neutrinojs/pwa']
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
particular use case. Just know that you can use webpack-chain to modify any part of the underlying webpack configuration
using its API.

This `neutrino.config` is an accumulation of all configuration up to this moment. All Neutrino middleware and presets
interact with and make changes through this config, which is all available to you. For example, if you are using the
presets `@neutrinojs/react` and `@neutrinojs/karma`, any config set can be extended, manipulated, or removed.

_Example: Neutrino's React preset adds `.jsx` as a module extension. Let's remove it._

```js
module.exports = {
  use: [
    '@neutrinojs/react',
    (neutrino) => neutrino.config.resolve.extensions.delete('.jsx')
  ]
};
```

_Example: Neutrino's Node.js preset has performance hints disabled. Let's re-enable them._

```js
module.exports = {
  use: [
    '@neutrinojs/node',
    (neutrino) => neutrino.config.performance.hints('error')
  ]
};
```

Remember, middleware can also have their own custom options for making some changes easier without having to resort to
interacting with the Neutrino API; see your respective middleware for details. See the [documentation on the
configuration API using webpack-chain](../webpack-chain.md) for all ways you can modify a config instance to solve
your use cases.

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
