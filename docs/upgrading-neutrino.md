# Upgrading from Neutrino v4 to v5

Neutrino v5 introduces a number of changes, with some of them being breaking changes. To upgrade from Neutrino v4
to v5, be sure to check this list for tasks you may need to perform to use this latest version:

- Updates to config for creating plugins (from webpack-chain v2 upgrade):

```js
// Creating plugins in v4
neutrino.config
  .plugin(name)
  .use(WebpackPlugin, ...args)
  
// Creating plugins in v5
neutrino.config
  .plugin(name, WebpackPlugin, ...args)
```

- Updates to config for modifying plugins (from webpack-chain v2 upgrade):

```js
// Modifying plugins in v4
neutrino.config
  .plugin(name)
  .inject((Plugin, args) => new Plugin(...newArgs))
  
// Modifying plugins in v5
neutrino.config
  .plugin(name, args => newArgs);
```

- Updates to config for modifying loaders (from webpack-chain v2 upgrade). The function now gets its options directly
instead of being nested in an object:

```js
// Modifying loaders in v4
neutrino.config.module
  .rule('compile')
  .loader('babel', props => merge(props, {
    options: {
      plugins: ['object-rest-spread']
    }
  }));
  
// Modifying loaders in v5
neutrino.config.module
  .rule('compile')
  .loader('babel', options => merge(options, {
    plugins: ['object-rest-spread']
  }));
```

- Simple configuration via package.json now done from top-level `neutrino` object. Rename `config` to `neutrino`, and
rename `config.neutrino` to `neutrino.config`. Presets also fall under this `neutrino` object. The `custom` object has
been renamed to `options`.

```json
{
  "neutrino": {
    "config": {
      "entry": {
        "vendor": ["react"]
      }
    },
    "presets": [
      "neutrino-preset-react"
    ],
    "options": {
      "mocha": {
        "reporter": "nyan"
      }
    }
  }
}
```

- The Web preset has renamed its styling loader from `css` to `style`:

```js
// v4 API for Web preset
neutrino.config.module.rule('css')

// v5 API for Web preset
neutrino.config.module.rule('style')
```

```json
{
  "neutrino": {
    "config": {
      "module": {
        "rule": {
          "style": {}
        }
      }
    }
  }
}
```

- Jest upgraded to v19, which changes the option `testPathDirs` to `roots`.
- Linting base is deprecated in favor of `neutrino-middleware-eslint`:

```js
// v4 API
const lint = require('neutrino-lint-base');

lint(neutrino);
neutrino.config.module
  .rule('lint')
  .loader('eslint', props => merge(props, { rules: { /* */ } }));

// v5 API
const eslint = require('neutrino-middleware-eslint');

neutrino.use(eslint, {
  rules: { /* */ }
})
```

- When using a linting preset or consuming anything with `neutrino-middleware-eslint`, the `eslintrc()` method has been
moved from `neutrino.custom` to `.neutrino`:

```js
// v4 API
neutrino.custom.eslintrc();

// v5 API
neutrino.eslintrc();
```

- The Neutrino API no longer accepts preset strings in its constructor. The constructor now accepts an options object to
be set at `neutrino.options`:

```js
const Neutrino = require('neutrino');
const api = new Neutrino({ mocha: { reporter: 'nyan' } });

api.options.mocha.reporter // "nyan"
```

- Since the Neutrino API no longer accepts preset strings in its constructor, you must now pass presets and middleware
as code/functions to the `.use()` method. This means the API no longer does preset module resolution. This has been
moved to the CLI.

```js
// v4 API
const Neutrino = require('neutrino');
const api = new Neutrino(['neutrino-preset-node', 'neutrino-preset-mocha']);

// v5 API
const Neutrino = require('neutrino');
const api = new Neutrino();

api.use(require('neutrino-preset-node'));
api.use(require('neutrino.preset-mocha'));
```

- `neutrino.getWebpackOptions()` no longer caches the configuration after being called.
- Using a `node` target no longer skips the watcher for a builder, it now uses the Webpack source watcher. This means
commands like `neutrino start && node build` is obsolete. `neutrino build && node build` would work to start a Node
instance for production-built bundles.
