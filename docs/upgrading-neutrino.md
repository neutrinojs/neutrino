# Upgrading from Neutrino v4 to v5

Neutrino v5 introduces a number of changes, with some of them being breaking changes. To upgrade from Neutrino v4
to v5, be sure to check this list for tasks you may need to perform to use this latest version:

- Updates to config for creating plugins (from webpack-chain v3 upgrade):

```js
// Creating plugins in v4
neutrino.config
  .plugin(name)
  .use(WebpackPlugin, ...args)

// Creating plugins in v5
neutrino.config
  .plugin(name)
  .use(WebpackPlugin, args)
```

- Updates to config for modifying plugins (from webpack-chain v3 upgrade):

```js
// Modifying plugins in v4
neutrino.config
  .plugin(name)
  .inject((Plugin, args) => new Plugin(...newArgs))

// Modifying plugins in v5
neutrino.config
  .plugin(name)
  .tap(args => newArgs);
```

- Updates to config for creating loaders (from webpack-chain v3 upgrade):

```js
// Creating loaders in v4
neutrino.config.module
  .rule('compile')
  .loader('babel', 'babel-loader', {
    options: {
      plugins: ['object-rest-spread']
    }
  });

// Creating loaders in v5
neutrino.config.module
  .rule('compile')
  .use('babel')
    .loader('babel-loader')
    .options({ plugins: ['object-rest-spread'] });
```

- Updates to config for modifying loaders (from webpack-chain v3 upgrade). The function now gets its options directly
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
    .use('babel')
      .tap(options => merge(options, { plugins: ['object-rest-spread'] }));
```

- Updates to `include` and `exclude` for rules (from webpack-chain v3). In the previous webpack-chain
package, `include` and `exclude` were functions where you provided paths as arguments. These are now
`ChainedMap`s, making them much more extensible should you need to manipulate these values:

```js
// Adding rule includes and excludes in v4
neutrino.config.module
  .rule('compile')
    .include(x, y)
    .exclude(x, y);

// Adding rule includes and excludes in v5
neutrino.config.module
  .rule('compile')
    .include
      .add(x)
      .add(y)
      .end()
    .exclude
      .add(x)
      .add(y);

// You can also use .merge() to add multiple paths at once:
neutrino.config.module
  .rule('compile')
    .include.merge([x, y]).end()
    .exclude.merge([x, y]);
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
    "use": [
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

- The Web preset has renamed its styling rule from `css` to `style`:

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

- The Neutrino CLI has renamed `--presets` to `--use` to better reflect the usage of middleware and presets, and to
make the inclusion of middleware consistent with the API at `neutrino.use()`.
- Jest upgraded to v19, which changes the option `testPathDirs` to `roots`. Jest options set using
package.json can now only be done at `neutrino.options.jest` (no more package.json `jest`);
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
  eslint: {
    rules: { /* */ }
  }
})
```

- When using a linting preset or consuming anything with `neutrino-middleware-eslint`, the `eslintrc()` method has been
moved from `neutrino.custom.eslintrc` to `neutrino.eslintrc`:

```js
// v4 API
neutrino.custom.eslintrc();

// v5 API
neutrino.eslintrc();
```

- The default export of the Neutrino package is now an object with several methods, one of these being the low-level
Neutrino API:

```js
const { Neutrino } = require('neutrino');
```

- The Neutrino API has undergone significant changes and no longer needs to be called as a constructor with `new`.

- The Neutrino API no longer accepts preset strings as its argument. The function now accepts an options object to
be set at `neutrino.options`:

```js
const { Neutrino } = require('neutrino');
const api = Neutrino({ mocha: { reporter: 'nyan' } });

api.options.mocha.reporter // "nyan"
```

- Since the Neutrino API no longer accepts preset strings in its constructor, you must now pass presets and middleware
as code/functions to the `.use()` method.

```js
// v4 API
const Neutrino = require('neutrino');
const api = new Neutrino(['neutrino-preset-node', 'neutrino-preset-mocha']);

// v5 API
const { Neutrino } = require('neutrino');
const api = Neutrino();

api.use(require('neutrino-preset-node'));
api.use(require('neutrino-preset-mocha'));
```

This also means the API function no longer does preset module resolution. If you wish to require presets and middleware
and have them simultaneously `use`d, use `requiresAndUses`:

```js
// v5 API
const { Neutrino } = require('neutrino');
const api = Neutrino();

api.usesAndRequires([
  'neutrino-preset-node',
  'neutrino-preset-mocha'
]);
```

- `neutrino.getWebpackOptions()` has been removed in favor of the lower level to `neutrino.config.toConfig()`.
- Using a `node` target no longer skips the watcher for a builder, it now uses the Webpack source watcher. This means
commands like `neutrino start && node build` are obsolete. `neutrino build && node build` would work to start a Node
instance for production-built bundles.
