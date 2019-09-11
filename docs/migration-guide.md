# Migration Guide

## Contents

- [Neutrino v8 to v9](#neutrino-v8-to-v9)
- [Neutrino v7 to v8](#neutrino-v7-to-v8)
- [Neutrino v6 to v7](#neutrino-v6-to-v7)
- [Neutrino v5 to v6](#neutrino-v5-to-v6)
- [Neutrino v4 to v5](#neutrino-v4-to-v5)

## Neutrino v8 to v9

Neutrino v9 is our largest release ever, bringing the preset and middleware ecosystem back to the
native tools and utilities for which they were originally created. The biggest breaking change
is the necessity to use external tools *alongside* Neutrino now, i.e. webpack, ESLint, Jest, Karma,
and others' native CLIs will be used in tandem with Neutrino.

Additionally, the Neutrino API no longer accepts any middleware format other than functions.
The `.neutrinorc.js` file is an exception, which still supports an object-based definition
for setting Neutrino options. There is now a new package to assist in migration changes to core
Neutrino middleware which are now middleware factories, since packages can no longer be required
for you:

```bash
npx @neutrinojs/migrate
```

```js
// Before:
module.exports = {
  use: [
    '@neutrinojs/react'
  ]
};

// After:
const react = require('@neutrinojs/react');

module.exports = {
  use: [
    react()
  ]
};
```

See the [migration tool documentation](./migrate.md) for more details.

Unfortunately the migration tool is not yet able to handle other types of breaking changes
(see [#1336](https://github.com/neutrinojs/neutrino/issues/1336)), so after running the tool
you will also need to:

1. Update the `neutrino` and `@neutrinojs/*` dependencies in `package.json` to version 9,
   and remove any packages that do not have a v9 release (such as `@neutrinojs/env`).

2. Remove and re-generate any Yarn/npm lockfiles (eg `yarn.lock` or `package-lock.json`),
   to prevent problems caused by leftover dependencies.

3. Refer to the updated package installation instructions on your build, lint and test preset's
  documentation pages, making sure to:

    - install the new peer dependencies (such as `webpack`, `eslint`, `jest`)
    - update the `package.json` scripts (such as `build`, `start`, `lint`) with the recommended values
    - create the configuration file for each tool (such as `webpack.config.js`, `.eslintrc.js`, `jest.config.js`).
      NB: The `.eslintrc.js` contents has changed, so will need updating if it already exists.

4. Try running the yarn/npm build/start/test/lint commands to see if further migration steps
   are suggested via configuration error messages.

5. Review the breaking changes listed below to check if any other adjustments are required.

To debug any difficulties in the upgrade process, you can run your respective Neutrino v8 command
with `--inspect-new` and compare it with the output of Neutrino v9's `--inspect` flag. For example,
to compare the difference between a v8 and v9 build, you can run respectively:

```sh
# Output v8 configuration
neutrino build --inspect-new

# Output v9 configuration
neutrino --inspect --mode production
```

You can also output these to files and `diff` them:

```sh
# Output v8 configuration
neutrino build --inspect-new > v8.config

# Output v9 configuration
neutrino --inspect --mode production > v9.config

git diff --no-index v8.config v9.config
```

Please [file an issue](https://github.com/neutrinojs/neutrino/issues) if any issue arises from the
upgrade that may not be outlined here.

A list of changes is detailed below for migrating:

- **BREAKING CHANGE** The minimum supported Node.js version is 10. Node.js 6-9 are no longer supported
[#792](https://github.com/neutrinojs/neutrino/pull/792) [#1481](https://github.com/neutrinojs/neutrino/pull/1481).
- **BREAKING CHANGE** Consumption of middleware and presets are now dependent on the external CLIs and
configuration files for which they are intended [#852](https://github.com/neutrinojs/neutrino/pull/852).
This does not negate the need for a `.neutrinorc.js` file
in your projects, but rather is the configuration format for declaring all the middleware for a project. As
an example, using the `@neutrinojs/react` preset also requires an installation of `webpack`,
`webpack-dev-server`, and `webpack-cli`, as well as the creation of `webpack.config.js` file and the update
of the script commands listed in `package.json`. **Refer to the updated package installation instructions on your
build, lint and test preset's documentation pages.**
- **BREAKING CHANGE** With the necessity of external CLIs means the removal of most of the Neutrino CLI's
commands [#852](https://github.com/neutrinojs/neutrino/pull/852):
  - `neutrino build` can typically be replaced with `webpack --mode production`.
  - `neutrino start` can typically be replaced with `webpack-dev-server --mode development --open`.
  - `neutrino test` can typically be replaced with the CLI of your test runner,
  e.g. `jest`, `karma start --single-run`, or `mocha`.
  - `neutrino lint` can typically be replaced with `eslint --cache --format codeframe --ext mjs,jsx,js src`.
  - `neutrino --inspect` command still exists to get information about the configuration that Neutrino will use.
- **BREAKING CHANGE** The Web, React, Vue, Node.js, and Library presets now use `useBuiltIns: 'usage'` as the
default when configuring `@babel/preset-env` for polyfills. As a result you no longer need to manually import
`core-js`, `@babel/polyfill`, or `regenerator-runtime/runtime` in your entry points, as was neceesary when
`useBuiltIns: 'entry'` was the default setting. **Note:** `core-js` still needs to be present in your `package.json`
for this default to take effect. [#1484](https://github.com/neutrinojs/neutrino/issues/1470)
- **BREAKING CHANGE** With the removal of the Neutrino CLI and its `--use` flag, the `.neutrinorc.js` file for
setting middleware is now mandatory within a project.
- **BREAKING CHANGE** With the removal of the Neutrino CLI, many of the Neutrino API methods and functionality
were no longer needed. This includes removal of `neutrino.options.command.` See the updated Neutrino API docs
for updated information.
- **BREAKING CHANGE** The Neutrino API's `use` method now only supports functions as middleware.
- **BREAKING CHANGE** Since the Neutrino API now only recognizes functions as middleware, all core middleware
packages export a factory function for accepting their options. This also means that middleware must be
manually required and passed to Neutrino as it can no longer be required for you:

```js
// .neutrinorc.js
const react = require('@neutrinojs/react');

module.exports = {
  use: [
    react(), // default options
    react(options) // custom options
  ]
}
```

- **BREAKING CHANGE** The `@neutrinojs/fork` middleware has been removed
[#852](https://github.com/neutrinojs/neutrino/pull/852). Either call webpack with separate configuration files
calling out to Neutrino, or export multiple configurations from your `webpack.config.js` file:

```js
// webpack.config.js
const neutrino = require('neutrino');

const config = neutrino().webpack();

module.exports = [
  // first build configuration
  config,

  // second build configuration
  { ...config, libraryTarget: 'commonjs2' },
];
```

- **BREAKING CHANGE** The recommended method for setting Neutrino's `root` directory option has changed.
You should set this from your `.neutrinorc.js` file to have it apply to all external configuration files
[#1041](https://github.com/neutrinojs/neutrino/pull/1041).

```js
// .neutrinorc.js
module.exports = {
  options: {
    root: __dirname
  }
};
```

- **BREAKING CHANGE** You can no longer define an `env` section in `.neutrinorc.js` configuration.
In order to make environment-specific changes, conditionally define middleware or configuration
overrides using environment variable values [#852](https://github.com/neutrinojs/neutrino/pull/852):

```js
// .neutrinorc.js
const react = require('@neutrinojs/react');
const example = require('neutrino-preset-example');

module.exports = {
  use: [
    react(),
    (neutrino) => {
      if (process.env.NODE_ENV === 'test') {
        neutrino.use(example);
      }
    }
  ]
}
```

- **BREAKING CHANGE** Upgraded to latest major versions of webpack, webpack-dev-server, Babel,
ESLint, and related packages [#809](https://github.com/neutrinojs/neutrino/pull/809) and others.
- **BREAKING CHANGE** The `@neutrinojs/chunk` middleware has been removed in favor of webpack's
improved functionality around `splitChunks` [#809](https://github.com/neutrinojs/neutrino/pull/809). See
[the split chunks documentation](https://webpack.js.org/plugins/split-chunks-plugin/) for more information.
Usage of the `vendor` entry point will now throw an error when used with v9 and should not be used.
- **BREAKING CHANGE** The `@neutrinojs/babel-minify` preset has been removed in favor
of the much faster `terser-webpack-plugin` (which is the new default in webpack 4.26.0)
[#809](https://github.com/neutrinojs/neutrino/pull/809),
[#1158](https://github.com/neutrinojs/neutrino/pull/1158) and
[#1215](https://github.com/neutrinojs/neutrino/pull/1215).
- **BREAKING CHANGE** The `@neutrinojs/web` and dependent presets have renamed the `minify.babel` option
to `minify.source` [#809](https://github.com/neutrinojs/neutrino/pull/809).
- **BREAKING CHANGE** The `@neutrinojs/web` and dependent presets no longer include the
`@neutrinojs/image-minify` or `@neutrinojs/style-minify` middleware. This means there are no preset
options for `minify.image` and `minify.style` [#809](https://github.com/neutrinojs/neutrino/pull/809).
- **BREAKING CHANGE** The `@neutrinojs/minify` package has been removed. The remaining individual minification
middleware packages can be used instead [#809](https://github.com/neutrinojs/neutrino/pull/809).
- **BREAKING CHANGE** The `@neutrinojs/image-minify` middleware has been removed
[#1105](https://github.com/neutrinojs/neutrino/pull/1105).
- **BREAKING CHANGE** The `@neutrinojs/pwa` middleware has been removed
[#1105](https://github.com/neutrinojs/neutrino/pull/1330).
- **BREAKING CHANGE** The `@neutrinojs/stylelint` middleware has been removed
[#1105](https://github.com/neutrinojs/neutrino/pull/1110).
- **BREAKING CHANGE** The `@neutrinojs/react` and `@neutrinojs/preact` packages no longer use
`babel-plugin-jsx-pragmatic` [#827](https://github.com/neutrinojs/neutrino/pull/827). This means if you
did not import React or preact into your files using JSX, you will now need to import these packages
explicitly when using JSX.

```diff
- import { Component } from 'react';
+ import React, { Component } from 'react';
```

- **BREAKING CHANGE** `@neutrinojs/react` will now use the react-hot-loader v4 peerDependency when installed
in your app [#902](https://github.com/neutrinojs/neutrino/pull/902). See
[React Hot Loader migration](https://github.com/gaearon/react-hot-loader#migrating-from-v3) for instructions on upgrading
to RHL v4 while installing it into your project also.
- **BREAKING CHANGE** `@neutrinojs/web`, `@neutrinojs/node`, and their dependent presets no longer configure
defaults for copying static files at build time [#814](https://github.com/neutrinojs/neutrino/pull/814).
Use the `@neutrinojs/copy` middleware to configure this for v9. For example:

```js
// .neutrinorc.js
const copy = require('@neutrinojs/copy');

module.exports = {
  use: [
    // ...
    copy({
      patterns: [{
        context: 'src/static',
        from: '**/*',
        to: 'static',
      }],
    })
  ]
};
```

- **BREAKING CHANGE** `@neutrinojs/copy` has renamed its `debug` option to `logLevel` to be synonymous
with the option provided by [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin#loglevel).
This option is now a string, not a boolean.
- **BREAKING CHANGE** The `neutrino.options.host` and `neutrino.options.port` options have been removed
[#852](https://github.com/neutrinojs/neutrino/pull/852). Set `host` and `port` via the `devServer` option
of the web/react/... presets instead.
- **BREAKING CHANGE** `@neutrinojs/web` and dependent presets now default `output.publicPath` to `'/'`,
which means that apps not served from the root of a domain (such as those hosted on GitHub pages) will
need to explicitly set their `publicPath` [#1185](https://github.com/neutrinojs/neutrino/pull/1185).
See the [deployment path documentation](./packages/web.md#deployment-path).
- **BREAKING CHANGE** `@neutrinojs/dev-server` (used by `@neutrinojs/web`) no longer sets
[contentBase](https://webpack.js.org/configuration/dev-server/#devserver-contentbase)
by default, meaning that in development any files that are not part of the webpack build need to be
explicitly included (such as by importing from JS or using `@neutrinojs/copy`) or they will not be
accessible from the dev server [#1165](https://github.com/neutrinojs/neutrino/pull/1165).
This prevents missing files from only being discovered once in production.
- **BREAKING CHANGE** `@neutrinojs/dev-server` no longer sets
[public](https://webpack.js.org/configuration/dev-server/#devserver-public) or
[host](https://webpack.js.org/configuration/dev-server/#devserver-host), meaning that
for certain workflows (such as running webpack-dev-server behind a proxy) you may need to set
them yourself. In particular, due to a bug in the previous implementation, the dev server
used to be accessible on all network interfaces, whereas it is now correctly only available
over localhost. As such if running webpack-dev-server from within a Docker container or VM,
you will now need to set `host` to `0.0.0.0` to allow connections from the host machine.
- **BREAKING CHANGE** Babel has been upgraded from v6 to v7 [#845](https://github.com/neutrinojs/neutrino/pull/809).
Any additional Babel plugins and presets you use in your projects should be compatible with Babel v7 if
they are still necessary.
- **BREAKING CHANGE** The [fast-async](https://github.com/MatAtBread/fast-async) Babel plugin is no longer used,
so async functions will not be de-sugared to Promises by default any more [#790](https://github.com/neutrinojs/neutrino/pull/790).
This means the preset option of `polyfills.async` has been removed.
- **BREAKING CHANGE** The output format from `neutrino --inspect` has changed and is equivalent to the
`neutrino --inspect-new` in Neutrino v8 [#928](https://github.com/neutrinojs/neutrino/pull/928).
- **BREAKING CHANGE** The path and filename of built files has changed. Files with hashed filenames
are now output under an `assets/` subdirectory, and the hash has been shortened to 8 characters
[#930](https://github.com/neutrinojs/neutrino/pull/930) and [#1174](https://github.com/neutrinojs/neutrino/pull/1174).
If you set custom headers for these files in your web server configuration (such as a long-expiry
`Cache-Control` header), the rules/regex for them will need to be updated.
- **BREAKING CHANGE** Module resolution now uses the [webpack 4 defaults](https://webpack.js.org/configuration/resolve/#resolve-modules)
[#926](https://github.com/neutrinojs/neutrino/pull/926). This means that the option `neutrino.options.node_modules`
has been removed.
- **BREAKING CHANGE** The font and image loader rules have now been consolidated into a single rule for
`@neutrinojs/font-loader` and another for `@neutrinojs/image-loader` [#858](https://github.com/neutrinojs/neutrino/pull/858).
- **BREAKING CHANGE** `@neutrinojs/font-loader` now uses [`file-loader`](https://webpack.js.org/loaders/file-loader/) instead of
[`url-loader`](https://webpack.js.org/loaders/url-loader/)
[#858](https://github.com/neutrinojs/neutrino/pull/858). This prevents asset inlining and will always generate
separate files.
- **BREAKING CHANGE** `@neutrinojs/style-loader` now uses [`mini-css-extract-plugin`](https://webpack.js.org/plugins/mini-css-extract-plugin/)
instead of [`extract-text-webpack-plugin`](https://webpack.js.org/plugins/extract-text-webpack-plugin/)
[#809](https://github.com/neutrinojs/neutrino/pull/809). This means any options you may have passed for `options.extract.plugin`
must be updated for the new plugin.
- **BREAKING CHANGE** `@neutrinojs/compile-loader` now sets the `babelrc` option to `false`
[#826](https://github.com/neutrinojs/neutrino/pull/858). If you wish to force specifying additional Babel
configuration via a configuration file, you can set it to `true` via `babel: { babelrc: true }`.
- **BREAKING CHANGE** `@neutrinojs/eslint` and dependent middleware now throw if they are used by Neutrino after
a compile preset [#939](https://github.com/neutrinojs/neutrino/pull/939), or if used with unrecognised
[eslint-loader options](https://github.com/webpack-contrib/eslint-loader#options)
[#1182](https://github.com/neutrinojs/neutrino/pull/1182). This is to prevent using an unknowingly broken configuration.
- **BREAKING CHANGE** Most Neutrino middleware now throws if used twice with the same rule IDs. This is to
prevent mis-configurations seen in the wild (such as using both `@neutrinojs/web` and one of the lower-level
middleware it uses at the same time) [#1162](https://github.com/neutrinojs/neutrino/pull/1162).
- **BREAKING CHANGE** As Neutrino no longer supplies a CLI for executing project commands, the `--debug` flag no
longer exists [#852](https://github.com/neutrinojs/neutrino/pull/852). You can still output debug information for
middleware in your `.neutrinorc.js` with:

```js
module.exports = {
  options: {
    debug: true
  }
};
```

- **BREAKING CHANGE** `@neutrinojs/html-loader` used by the web-related presets now parse URLs defined in link tags
in the HTML template [#943](https://github.com/neutrinojs/neutrino/pull/943).
- **BREAKING CHANGE** `@neutrinojs/html-template` now uses a custom template instead of one provided by
[html-webpack-template](https://github.com/jaketrent/html-webpack-template), which supports a smaller set of options
but better html-webpack-plugin integration. You can override with your own template for more in-depth customization of
this template and its content [#1049](https://github.com/neutrinojs/neutrino/pull/1049).
- **BREAKING CHANGE** The `@neutrinojs/hot` [#981](https://github.com/neutrinojs/neutrino/pull/981),
`@neutrinojs/env` [#983](https://github.com/neutrinojs/neutrino/pull/983), and
`@neutrinojs/loader-merge` [#1182](https://github.com/neutrinojs/neutrino/pull/1182) middleware have been
removed and their relevant functionality is now configured directly by its previously-consuming presets.
- **BREAKING CHANGE** `@neutrinojs/node` now compiles to the supported version of Node.js being used to run the build
[#991](https://github.com/neutrinojs/neutrino/pull/991). Previously this was always defaulted to a particular Node.js v6
version. For example, if you use Node.js v8 to run webpack, Neutrino will tell Babel to compile your project to support
back to Node.js v8.
- **BREAKING CHANGE** Various build outputs and settings used by Neutrino were driven by the `NODE_ENV` environment
variable [#972](https://github.com/neutrinojs/neutrino/pull/972). How the environment variable drives some of these
options has changed and may cause output that is different than in v8. For example, sometimes output was controlled
when the value *was set to `development`*, but now may be done when the value *is not `production`*.
- **BREAKING CHANGE** The merging of Babel options has been updated to *not merge array options*, but instead
overwrite them [#1022](https://github.com/neutrinojs/neutrino/pull/1022).
- **BREAKING CHANGE** `@neutrinojs/eslint` and its dependent middleware now require ESLint v5, which may mean breaking
changes to rule configuration and any `parserOptions` modifications [#1025](https://github.com/neutrinojs/neutrino/pull/1025).
See the [ESLint migration docs](https://eslint.org/docs/user-guide/migrating-to-5.0.0) for more information.
- **BREAKING CHANGE** `@neutrinojs/eslint` and its dependent middleware now only set loader-related
default options if `useEslintrc` is `true`, to prevent linting configuration defaults from conflicting
with values set in `.eslintrc.*` [#1182](https://github.com/neutrinojs/neutrino/pull/1182).
See the new documentation explaining how to [use your own `.eslintrc.*`](./packages/eslint.md#using-your-own-eslintrc).
- **BREAKING CHANGE** The `options.mains` Neutrino option can now also accept an object per entry point for setting
individual options for html-webpack-plugin [#1029](https://github.com/neutrinojs/neutrino/pull/1029). The previous API
for setting these properties as strings is still supported. This also introduces a breaking API change as accessing an
entry point property on `neutrino.options.mains` now returns a normalized object, even when using string options.
- **BREAKING CHANGE** When configuring webpack with a target of `node` the `@neutrinojs/jest` preset will default its
`testEnvironment` to also be `node` instead of `jsdom` [#1030](https://github.com/neutrinojs/neutrino/pull/1030).
- **BREAKING CHANGE** `@neutrinojs/web` no longer supports the shorthand of `devServer.proxy`
being set to a string [#1175](https://github.com/neutrinojs/neutrino/pull/1175). Instead pass an
object using the [options here](https://webpack.js.org/configuration/dev-server/#devserver-proxy).
- **BREAKING CHANGE** `@neutrinojs/web` and its dependent middleware no longer have the `options.hotEntries` option
[#902](https://github.com/neutrinojs/neutrino/pull/902).
- **BREAKING CHANGE** `@neutrinojs/web` and its dependent middleware no longer support
`style.extract` being set to `true` [#1221](https://github.com/neutrinojs/neutrino/pull/1221).
Override `style.extract.enabled` instead.
- **BREAKING CHANGE** `@neutrinojs/web`, its dependent middleware, and `@neutrinojs/library` no longer include
`worker-loader` for automatically loading `*.worker.js` files [#1069](https://github.com/neutrinojs/neutrino/pull/1069).
To add back support use a `.neutrinorc.js` configuration similar to:

```js
module.exports = {
  use: [
    // ...
    (neutrino) => {
      neutrino.config.output
        .globalObject('this') // will prevent `window`
      .end()
      .module
        .rule('worker')
          .test(neutrino.regexFromExtensions(['worker.js']))
          .use('worker')
            .loader(require.resolve('worker-loader'))
            .options({
              // See: https://github.com/webpack-contrib/worker-loader#options
            });
    }
  ]
};
```

- **BREAKING CHANGE** The loading order for `config.resolve.extensions` has been rearranged to be closer in parity to
what webpack has configured by default [#1080](https://github.com/neutrinojs/neutrino/pull/1080).
- **BREAKING CHANGE** The tests directory is now additionally linted by default with `@neutrinojs/eslint` and its
dependent middleware [#951](https://github.com/neutrinojs/neutrino/pull/951).
- **BREAKING CHANGE** TypeScript extensions are no longer set by default in `neutrino.options.extensions`, and the
`vue` extension is only added when used with `@neutrinojs/vue`.
- **BREAKING CHANGE** `@neutrinojs/compile-loader` no longer exports a `merge` function
[#1220](https://github.com/neutrinojs/neutrino/pull/1220). See the documentation on
[merging babel configuration](./packages/compile-loader.md#merging-babel-configuration)
for how to use the [babel-merge](https://www.npmjs.com/package/babel-merge) package directly instead.
- **BREAKING CHANGE** `@neutrinojs/clean` options are now a single object format and automatically cleans the output
build directory and does not accept `root` or `paths` options. The `allowExternal` option has been changed to
`dangerouslyAllowCleanPatternsOutsideProject`. See the other updated options for
[clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin).
- **BREAKING CHANGE** Various dependencies have been updated which may bring their own breaking changes. Please
check and test your project to ensure proper functionality.
- **BREAKING CHANGE** `@neutrinojs/web` and its dependent middleware no longer accept a `manifest` option or include `webpack-manifest-plugin` automatically ([#1254](https://github.com/neutrinojs/neutrino/pull/1254)). Users may add it themselves like so:

```js
// .neutrinorc.js
module.exports = {
  use: [
    // ...
    (neutrino) => {
      if (process.env.NODE_ENV === 'production') {
        neutrino.config.plugin('manifest')
          .use(require.resolve('webpack-manifest-plugin'));
      }
    }
  ]
}
```

- **BREAKING CHANGE** `@neutrinojs/style-loader` now creates a single `style` rule with `oneOfs`, instead of multiple rules for handling css modules ((#1281)[https://github.com/neutrinojs/neutrino/pull/1281]).
- **BREAKING CHANGE** `@neutrinojs/vue` now adds oneOfs instead of replacing existing style rules ((#1276)[https://github.com/neutrinojs/neutrino/pull/1276]).
- ESLint caching is now enabled by default for new projects, so it is recommended to specify `.eslintcache` as being
ignored from your source control commits.

[Compare all v9 changes](https://github.com/neutrinojs/neutrino/compare/v8.3.0...v9.0.0)

## Neutrino v7 to v8

Neutrino v8 introduces a number of changes, with some of them being breaking changes. To upgrade from Neutrino v7
to v8, be sure to check this list for tasks you may need to perform to use this latest version:

- **BREAKING CHANGE** Middleware and preset packages have been migrated and scoped under the new
[@neutrinojs](https://www.npmjs.com/org/neutrinojs) organization. See [Migrated Packages](#migrated-packages)
for the full list of deprecated packages and the new scoped packages to migrate to. The core `neutrino` package
remains available as is.
- **BREAKING CHANGE** Removed `entry` option in order to support multiple main entry points via new `mains` options.
See [Customization](./customization.md#optionsmains) for usage of `mains` in
`.neutrinorc.js`. See [API](./api.md#optionsmains) for usage of `mains` from the API.
([#487](https://github.com/neutrinojs/neutrino/pull/487))
- **BREAKING CHANGE** `*.css` files in mains chunks are no longer inlined into the JS bundle by default.
They are moved into a separate CSS file. To disable CSS extraction, pass `options.extract = false` to
the style-loader middleware, or `options.style.extract = false` to the web preset.
([#443](https://github.com/neutrinojs/neutrino/pull/443))
- **BREAKING CHANGE** There is no longer a plugin named `minify` when using the `minify` middleware. This is due
to the `minify` middleware now being a composition of three different middleware. The associated plugins are
`babel-minify`, `style-minify`, and `image-minify`, from their associated individual middleware, which can also be
used separately.
- **BREAKING CHANGE** The Karma preset now uses Headless Chrome by default to run tests. To that end,
you will need Chrome 60+ installed. ([#283](https://github.com/neutrinojs/neutrino/pull/283))
- **BREAKING CHANGE** The API methods `.call()` and `.run()` no longer accept additional middleware to load
prior to running their registered handler. If you wish to load middleware prior, use the `.use()` method first.
Also, these methods no longer automatically load `.neutrinorc.js` either, you must load this using `.use()` as well.
([#425](https://github.com/neutrinojs/neutrino/pull/425))
([#424](https://github.com/neutrinojs/neutrino/pull/424))
For a concrete example, `.eslintrc.js`, which utilizes these changes, would migrate to the following:

```js
const { Neutrino } = require('neutrino');

module.exports = Neutrino({ root: __dirname })
  .use('.neutrinorc.js')
  .call('eslintrc');
```

- **BREAKING CHANGE** When building, `file-loader` and `url-loader` will generate file names with pattern
`[name].[hash].[ext]` instead of `[hash].[ext]`. ([#435](https://github.com/neutrinojs/neutrino/pull/435))
- **BREAKING CHANGE** The web preset no longer uses the `script-ext` plugin. It was never functional and did not
serve a purpose at this time. ([#500](https://github.com/neutrinojs/neutrino/pull/500))

### Migrated Packages

| Deprecated Preset/Middleware | New Scoped Package |
| --- | --- |
| `neutrino-middleware-banner` | [`@neutrinojs/banner`](https://www.npmjs.com/package/@neutrinojs/banner) |
| `neutrino-middleware-chunk` | [`@neutrinojs/chunk`](https://www.npmjs.com/package/@neutrinojs/chunk) |
| `neutrino-middleware-clean` | [`@neutrinojs/clean`](https://www.npmjs.com/package/@neutrinojs/clean) |
| `neutrino-middleware-compile-loader` | [`@neutrinojs/compile-loader`](https://www.npmjs.com/package/@neutrinojs/compile-loader) |
| `neutrino-middleware-copy` | [`@neutrinojs/copy`](https://www.npmjs.com/package/@neutrinojs/copy) |
| `neutrino-middleware-dev-server` | [`@neutrinojs/dev-server`](https://www.npmjs.com/package/@neutrinojs/dev-server) |
| `neutrino-middleware-env` | [`@neutrinojs/env`](https://www.npmjs.com/package/@neutrinojs/env) |
| `neutrino-middleware-eslint` | [`@neutrinojs/eslint`](https://www.npmjs.com/package/@neutrinojs/eslint) |
| `neutrino-middleware-font-loader` | [`@neutrinojs/font-loader`](https://www.npmjs.com/package/@neutrinojs/font-loader) |
| `neutrino-middleware-hot` | [`@neutrinojs/hot`](https://www.npmjs.com/package/@neutrinojs/hot) |
| `neutrino-middleware-html-loader` | [`@neutrinojs/html-loader`](https://www.npmjs.com/package/@neutrinojs/html-loader) |
| `neutrino-middleware-html-template` | [`@neutrinojs/html-template`](https://www.npmjs.com/package/@neutrinojs/html-template) |
| `neutrino-middleware-image-loader` | [`@neutrinojs/image-loader`](https://www.npmjs.com/package/@neutrinojs/image-loader) |
| `neutrino-middleware-loader-merge` | [`@neutrinojs/loader-merge`](https://www.npmjs.com/package/@neutrinojs/loader-merge) |
| `neutrino-middleware-minify` | [`@neutrinojs/minify`](https://www.npmjs.com/package/@neutrinojs/minify) |
| `neutrino-middleware-pwa` | [`@neutrinojs/pwa`](https://www.npmjs.com/package/@neutrinojs/pwa) |
| `neutrino-middleware-start-server` | [`@neutrinojs/start-server`](https://www.npmjs.com/package/@neutrinojs/start-server) |
| `neutrino-middleware-style-loader` | [`@neutrinojs/style-loader`](https://www.npmjs.com/package/@neutrinojs/style-loader) |
| `neutrino-preset-airbnb-base` | [`@neutrinojs/airbnb-base`](https://www.npmjs.com/package/@neutrinojs/airbnb-base) |
| `neutrino-preset-jest` | [`@neutrinojs/jest`](https://www.npmjs.com/package/@neutrinojs/jest) |
| `neutrino-preset-karma` | [`@neutrinojs/karma`](https://www.npmjs.com/package/@neutrinojs/karma) |
| `neutrino-preset-mocha` | [`@neutrinojs/mocha`](https://www.npmjs.com/package/@neutrinojs/mocha) |
| `neutrino-preset-node` | [`@neutrinojs/node`](https://www.npmjs.com/package/@neutrinojs/node) |
| `neutrino-preset-react` | [`@neutrinojs/react`](https://www.npmjs.com/package/@neutrinojs/react) |
| `neutrino-preset-web` | [`@neutrinojs/web`](https://www.npmjs.com/package/@neutrinojs/web) |

## Neutrino v6 to v7

Neutrino v7 introduces some changes, most of which are from major version bumps of dependent packages.
To upgrade from Neutrino v6 to v7, be sure to check this list for tasks you may need to perform to use
this latest version:

- **BREAKING CHANGE** webpack-chain upgraded to v4. The breakage from this upgrade is the `.noParse` method
which is now a plain shortcut method, allowing you to set any value.
- **BREAKING CHANGE** webpack upgraded to v3. While most users should need no changes for this upgrade, be
aware that it may still be possible for something to change during this upgrade.
- **BREAKING CHANGE** The Web and React presets no longer include babel-polyfill by default, and have removed
the `polyfill.babel` option. If you need babel-polyfill in your app, please import it.
- **BREAKING CHANGE** ESLint has been upgraded to v4, which may bring linting configuration
changes.
- **BREAKING CHANGE** The Neutrino `static` option has been removed. The Web, React, and Node.js presets will
still copy files from a `src/static` directory if it exists, but you can override your own
copying directives using the `neutrino-middleware-copy` middleware.
- **BREAKING CHANGE** Certain processes like minification or starting the dev server used to happen during many
different values for the `NODE_ENV` environment variable. These are now controlled to run during
certain `NODE_ENV` values like `production` or `development`, or when using certain commands like
`start` or `build`. Look at the documentation for your specific presets to determine what environments or
commands are used for certain configuration changes.
- **BREAKING CHANGE** The minify plugin has switched to using the BabelMinifyWebpackPlugin, so the middleware
options have been renamed from `babili` to `minify` and from `overrides` to `plugin`,
e.g. `neutrino.use(minify, { minify: {}, plugin: {} })` or `['neutrino-middleware-minify', { minify: {}, plugin: {} }]`.

## Neutrino v5 to v6

Neutrino v6 introduces a number of changes, with some of them being breaking changes. To upgrade from Neutrino v5
to v6, be sure to check this list for tasks you may need to perform to use this latest version:

- **BREAKING CHANGE** Neutrino overrides and configuration is no longer done from package.json, but can automatically
be picked up in a `.neutrinorc.js` file. If you want to leave your configuration in package.json until
you migrate completely to the RC file, put the following contents in your `.neutrinorc.js` file:

```js
const pkg = require('./package.json');

module.exports = {
  options: pkg.neutrino.options || {},
  use: [
    ...(pkg.neutrino.use || []),
    neutrino => neutrino.config.merge(pkg.neutrino.config || {})
  ]
};
```

See the documentation on `.neutrinorc.js` for more details on overriding configuration.

- **BREAKING CHANGE** The Web and React presets no longer include a polyfill for `Buffer`. This saves approximately 60KB
of polyfills from being loaded, at the expense of using the `Buffer` constructor. If you need the `Buffer`
constructor or a dependency relies on it, you can override the configuration in `.neutrinorc.js`:

```js
neutrino.config.node.set('Buffer', true)
```

- **BREAKING CHANGE** Neutrino no longer relies on `HOST`, `PORT`, and `HTTPS` environment variables for overriding
the webpack-dev-server settings, respectively. You can choose to either override these from `.neutrinorc.js` or
a one-off basis using CLI options:

```js
// Override a preset/middleware:
module.exports = {
  use: [
    ['neutrino-preset-react', {
      devServer: {
        host: '192.168.1.10',
        port: 3000,
        https: true
      }
    }]
  ]
};
```

```js
// Override all presets:
module.exports = {
  options: {
    host: '192.168.1.10',
    port: 3000,
    https: true
  }
};
```

```bash
# Override from CLI
neutrino start --options.host 192.168.1.10 --options.port 3000 --options.https
```

- **BREAKING CHANGE** Setting `host` of `0.0.0.0` for webpack-dev-server is insecure and will not work properly. This
is from https://github.com/webpack/webpack-dev-server/issues/887 causing a potential security issue into webpack
users' machines. When using `host`, specify your actual local IP address, and Neutrino will bind it to the `public`
property of webpack-dev-server and set the host to `0.0.0.0` for you. Attempting to access the site from a host other
than specified will result in an invalid host header error.

Should you absolutely need to access the site from any potential host, for example if behind a proxy or firewall,
override from `.neutrinorc.js`:

```js
// Override a preset/middleware
module.exports = {
  use: [
    ['neutrino-preset-react', {
      devServer: {
        disableHostCheck: true
      }
    }]
  ]
};

// Override configuration
neutrino.config.devServer.disableHostCheck(true)
```

- **BREAKING CHANGE** The chunk middleware no longer includes a plugin named `"chunk"`, and instead exposes several
plugins which handle different chunking mechanisms: `named-modules`, `named-chunks`, `vendor-chunk`, `runtime-chunk`,
and `name-all`.

- **BREAKING CHANGE** With the changes in chunk middleware, there is no longer a named-modules middleware for v6 since
this now comes with the chunk middleware.

- **BREAKING CHANGE** All non-JS assets within your source directory are not automatically copied to the output
directory. A new Neutrino option for `static` now specifies a directory for all non-compiled/included assets, and this
defaults to `src/static`. For example, if you wanted to include some images into the build that are not `import`ed into
your project, you can place them in `src/static` and they will be automatically copied to `build/static`.

- **BREAKING CHANGE** The `run` function from Neutrino's exports has been removed in favor of a `run` method on the API.

- **BREAKING CHANGE** The `build`, `start`, `test`, and `inspect` functions from Neutrino's exports no longer
instantiate the Neutrino API, but are now functions that are passed to the Neutrino API's `run` method. For example, to
run the `build` function, you can pass it via:

```js
const { Neutrino, build } = require('neutrino');

Neutrino()
  .run('build', [middleware], build)
  .fork(errorHandler, successHandler);
```

See the [Neutrino API](./api.md) for details on the updated API.

- **BREAKING CHANGE** Since the Neutrino API has changed, creating a `.eslintrc.js` file has also changed. If you have
your middleware defined in `.neutrinorc.js`, your `.eslintrc.js` file can be as simple as:

```js
module.exports = require('neutrino/src/api')().call('eslintrc');
```

For a more verbose example version without `.neutrinorc.js`:

```js
const { Neutrino } = require('neutrino');
const api = Neutrino();

module.exports = api.call('eslintrc', ['neutrino-preset-airbnb-base', 'neutrino-preset-react']);
```

**BREAKING CHANGE** An empty object is no longer passed as options to middleware if no options have been specified.

**Dependency potential BREAKING CHANGES:**

  - `babel-core` upgraded to v7.0.0
  - `file-loader` upgraded to v0.11.2
  - `file-loader` removed from `html-loader` middleware, switched to `html-loader`
  - `babili-webpack-plugin` upgraded to v0.1.1
  - `css-loader` upgraded to v0.28.4
  - `style-loader` upgraded to v0.18.2
  - `jest` upgraded to v20.0.3
  - `react-hot-loader` upgraded to v3.0.0-beta.7
  

- Async polyfills are now using fast-async instead of Babel's regenerator. The reasoning is explained in the
[fast-async README](https://github.com/MatAtBread/fast-async):

> 'fast-async' is a Babel v6.x.x plugin that implements the ES7 keywords async and await using syntax transformation
at compile-time, rather than generators. The main reason for using 'fast-async' as opposed to Babel's default
implementation of async/await is performance (https://github.com/MatAtBread/nodent#performance) - it's 3-4 times faster
in a browser/node, and as much as 10 times faster on a mobile browsers, mainly due to avoiding generators
(and therefore regenerator).

If you wish to disable the fast-async polyfill, you can specify it to the Web, React, and Node.js presets from
your `.neutrinorc.js`:

```js
module.exports = {
  use: [
    ['neutrino-preset-web', {
      polyfills: { async: false }
    }]
  ]
};
```

- The React preset is now additionally Babel-compiled with `transform-class-properties`, and during `development` also
includes `transform-es2015-classes` to work around https://github.com/gaearon/react-hot-loader/issues/313.

- The Node.js preset, start-server middleware, and babel-preset-env in any middleware can be debugged with the `--debug`
CLI flag or the Neutrino option `debug`.

- The Node.js preset now compiles Babel to support Node.js LTS which has moved to v6.10 from v6.9.

- Babel compiles using a `cacheDirectory` to improve subsequent build times.

- The Neutrino API now exposes generic `prerun` and `run` events which are triggered prior to at any command
running, e.g. running `neutrino build` will trigger a `prebuild`, `prerun`, `build`, and `run` events.

- The ESLint middleware now defaults to a `development` NODE_ENV if none is specified.

- Configuration can now more easily be overridden based on the values of environment variables from `.neutrinorc.js`
using the `env` property. Each property within `env` maps to an environment variable with key-values mapping to 
environment values which contain further middleware. This works for any environment variable, not just `NODE_ENV`.
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

## Neutrino v4 to v5

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
      plugins: ['your-babel-plugin']
    }
  });

// Creating loaders in v5
neutrino.config.module
  .rule('compile')
  .use('babel')
    .loader('babel-loader')
    .options({ plugins: ['your-babel-plugin'] });
```

- Updates to config for modifying loaders (from webpack-chain v3 upgrade). The function now gets its options directly
instead of being nested in an object:

```js
// Modifying loaders in v4
neutrino.config.module
  .rule('compile')
  .loader('babel', props => merge(props, {
    options: {
      plugins: ['your-babel-plugin']
    }
  }));

// Modifying loaders in v5
neutrino.config.module
  .rule('compile')
    .use('babel')
      .tap(options => merge(options, { plugins: ['your-babel-plugin'] }));
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
- Using a `node` target no longer skips the watcher for a builder, it now uses the webpack source watcher. This means
commands like `neutrino start && node build` are obsolete. `neutrino build && node build` would work to start a Node
instance for production-built bundles.
