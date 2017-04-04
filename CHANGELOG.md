2017-04-02
==========

  * Update build executable to respect config stats. ([#163](https://github.com/mozilla-neutrino/neutrino-dev/issues/163))
  * fix eslint-semi-off middleware example ([#161](https://github.com/mozilla-neutrino/neutrino-dev/issues/161))

2017-03-31
==========

  * v5.2.0
  * Allow setting karma middleware options as overridable ([#160](https://github.com/mozilla-neutrino/neutrino-dev/issues/160))

2017-03-29
==========

  * neutrino v5.1.1
  * options.output mis-named as options.build ([#159](https://github.com/mozilla-neutrino/neutrino-dev/issues/159))
  * Releasing v5.1.0
  * Upgrading webpack-chain to v3.1 ([#157](https://github.com/mozilla-neutrino/neutrino-dev/issues/157))

2017-03-28
==========

  * Adding code coverage with Codacy support ([#156](https://github.com/mozilla-neutrino/neutrino-dev/issues/156))
  * Use smarter publish script ([#154](https://github.com/mozilla-neutrino/neutrino-dev/issues/154))

2017-03-27
==========

  * fix docs for creating loaders ([#153](https://github.com/mozilla-neutrino/neutrino-dev/issues/153))
  * Releasing v5.0.2
  * Allow inspecting the API default exports without erroring ([#152](https://github.com/mozilla-neutrino/neutrino-dev/issues/152))

2017-03-26
==========

  * Middleware vs. Presets? ([#149](https://github.com/mozilla-neutrino/neutrino-dev/issues/149))
  * Changelog
  * Removing extraneous construct
  * Syncing packages to docs, adding scripts for publishing
  * Syncing package readmes with docs
  * Extracting webpack utils to their own file ([#147](https://github.com/mozilla-neutrino/neutrino-dev/issues/147))
  * use correct value for package.json config ([#146](https://github.com/mozilla-neutrino/neutrino-dev/issues/146))
    This might have been an old way to define the configuration?
    Only works when I use `neutrino`, otherwise I get an error:
    ```
    WebpackOptionsValidationError: Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.
    ```

2017-03-25
==========

  * Rdesign Advanced Customization examples to use Neutrino v5 fashion ([#145](https://github.com/mozilla-neutrino/neutrino-dev/issues/145))
  * Update upgrading-neutrino.md (eslint middleware) ([#144](https://github.com/mozilla-neutrino/neutrino-dev/issues/144))
    The code explaining the usage of `neutrino-middleware-eslint` was wrong here.
    It caused me a great headache last night, when I was migrating a pair of eslint presets.
    Thank god [eslint middleware documentation page](https://neutrino.js.org/middleware/neutrino-middleware-eslint/) is OK and you can
    compare and infer the correct usage.

2017-03-24
==========

  * Merge pull request [#141](https://github.com/mozilla-neutrino/neutrino-dev/issues/141) from eliperelman/publicpath-docs
    Adding documention about web publicPath
  * Adding documention about web publicPath

2017-03-23
==========

  * Updating changelog
  * Updating yarn.lock files
  * Merge pull request [#140](https://github.com/mozilla-neutrino/neutrino-dev/issues/140) from eliperelman/v5-docs-again
    Hopefully last round of docs changes for v5
  * Hopefully last round of docs changes
  * Mocha dependency upgrades
  * Merge pull request [#139](https://github.com/mozilla-neutrino/neutrino-dev/issues/139) from eliperelman/v5-deps
    Upgrading dependencies
  * Upgrading dependencies
  * Merge pull request [#138](https://github.com/mozilla-neutrino/neutrino-dev/issues/138) from eliperelman/webpack-validate
    Validate webpack configuration before running compiler
  * Validate webpack configuration before running compiler

2017-03-22
==========

  * Merge pull request [#137](https://github.com/mozilla-neutrino/neutrino-dev/issues/137) from eliperelman/functional
    Functional refactor
  * Functional refactor

2017-03-20
==========

  * Merge pull request [#135](https://github.com/mozilla-neutrino/neutrino-dev/issues/135) from eirikurn/issue-116
    Resolve packages from parent node_modules folders
  * Fix resolution issues when linking neutrino
    Some presets depend on `webpack` and `webpack-dev-server` for HMR
    logic. This commit makes those dependencies explicit and fixes issues
    when installing neutrino packages with `npm link`.
  * Resolve packages from parent node_modules folders
    A la classic NodeJS resolution and webpack default. See [#116](https://github.com/mozilla-neutrino/neutrino-dev/issues/116).
  * Merge pull request [#132](https://github.com/mozilla-neutrino/neutrino-dev/issues/132) from jaridmargolin/master
    Fix typo in develop function.
  * Fix typo in develop function.

2017-03-19
==========

  * Merge pull request [#127](https://github.com/mozilla-neutrino/neutrino-dev/issues/127) from jaridmargolin/neutrino-webpack
    Neutrino webpack

2017-03-18
==========

  * Remove unnecessary specificity from webpack config test.
  * Pull webpack actions out of Neutrino class.
  * Merge pull request [#123](https://github.com/mozilla-neutrino/neutrino-dev/issues/123) from jaridmargolin/getWebpackConfig
    Rename `getWebpackOptions` to `getWebpackConfig`.

2017-03-17
==========

  * Rename `getWebpackOptions` to `getWebpackConfig`.

2017-03-16
==========

  * Updating yarn.lock
  * Merge pull request [#119](https://github.com/mozilla-neutrino/neutrino-dev/issues/119) from jaridmargolin/neutrino-refactor
    Neutrino refactor
  * Add packages/bin/neutrino to lint files list.
  * Set environment variable, NODE_ENV, inside of `runCommand` (also adds --env option to CLI).
  * Add `runCommand` helper method to Neutrino.
  * Remove concept of "presets" in favor of "middleware(s)/use".
  * Move `run` process logic to location of call.
  * Make run method in bin/neutrino self contained.
  * Move require/import middleware functionality to api.
  * Merge pull request [#120](https://github.com/mozilla-neutrino/neutrino-dev/issues/120) from eliperelman/fixing-linting
    Fixing linting to run for all packages
  * Fixing linting to run for all packages

2017-03-14
==========

  * Merge pull request [#117](https://github.com/mozilla-neutrino/neutrino-dev/issues/117) from helfi92/fix-links
    Fix link
  * Switch to relative paths
  * Fix link

2017-03-13
==========

  * Merge pull request [#115](https://github.com/mozilla-neutrino/neutrino-dev/issues/115) from eirikurn/patch-1
    Fix svg mime-type
  * Fix svg mime-type
    Browsers don't display svg from data-uri if the mimetype is `application/svg+xml` (testing with \<img> tag in Firefox and Chrome). However, `image/svg+xml` works.
  * Merge pull request [#111](https://github.com/mozilla-neutrino/neutrino-dev/issues/111) from eliperelman/compile-targets
    Adding option-configurable compile targets
  * Adding option-configurable compile targets
  * Merge pull request [#88](https://github.com/mozilla-neutrino/neutrino-dev/issues/88) from guzart/patch-1
    Add support building react-native app

2017-03-12
==========

  * Add support building react-native app
  * Merge pull request [#110](https://github.com/mozilla-neutrino/neutrino-dev/issues/110) from eliperelman/test-preset-config-on-test
    Defer test configuration overrides until on:test
  * Defer test configuration overrides until on:test

2017-03-09
==========

  * Merge pull request [#106](https://github.com/mozilla-neutrino/neutrino-dev/issues/106) from eliperelman/linting-round-2
    Using neutrino to lint itself
  * Merge pull request [#105](https://github.com/mozilla-neutrino/neutrino-dev/issues/105) from psyrendust/devtool-sourcemap
    Should generate correct sourcemaps during dev
  * Using neutrino to lint itself
    Removing --fix from lint command
  * Should generate correct sourcemaps during dev
    The current [devtool](https://webpack.js.org/configuration/devtool/) configuration of `eval` makes it very difficult to debug your source code when running the development command `neutrino start`.
    I did some digging and there is an issue with sourcemaps and Webpack 2. See https://github.com/webpack/webpack/issues/3165 and https://github.com/webpack/webpack/issues/4423 for more information.
    In the meantime, it would be great if the default setting for the development command `neutrino start` would generate correct sourcemaps with a reference to the original source and allow you to set breakpoints correctly. I did some tests in OS X Chrome v56.0.2924.87 (64-bit) by trying different [devtool](https://webpack.js.org/configuration/devtool/) configurations in a custom neutrino config that extends `neutrino-preset-web`.
    * `eval`: reports correct line in transformed code, and breakpoints work, but difficult to debug
    * `cheap-eval-source-map`: reports incorrect line in transformed code, breakpoints can be added, but are on incorrect line and don't work
    * `cheap-source-map`: reports incorrect line in transformed code, breakpoints work, but are on incorrect line
    * `cheap-module-eval-source-map`: reports incorrect line in source, breakpoints can be added, but are on incorrect line and don't work
    * `cheap-module-source-map`: reports incorrect line in source, breakpoints work, but are on incorrect line
    * `eval-source-map`: reports correct line in source, but breakpoints don't work
    * `source-map`: reports correct line in source, and breakpoints work
    * `nosources-source-map`: reports correct line in source, but no source is generated
    If you are just running `neutrino-preset-web` out of the box you should be able to debug your code easily. Making this change can cause slower rebuilds, but I'd be willing to wait a few 100ms (or whatever `--` means in time) to rebuild my code for better debugging.
    If and when the above Webpack 2 issues are fixed, I would suggest revisiting the `devtool` option by changing it to `cheap-module-eval-source-map` or `eval-source-map` for speedier rebuilds with sourcemaps that point to source code vs transpiled code.

2017-03-08
==========

  * Merge pull request [#102](https://github.com/mozilla-neutrino/neutrino-dev/issues/102) from aretecode/eslint
    eslint
  * unquote property names, rebase, remove react bits

2017-03-07
==========

  * Merge pull request [#103](https://github.com/mozilla-neutrino/neutrino-dev/issues/103) from eliperelman/readmes
    README updates for v5
  * README updates for v5
  * Merge pull request [#98](https://github.com/mozilla-neutrino/neutrino-dev/issues/98) from eliperelman/v5-docs
    v5 Docs
  * Merge pull request [#86](https://github.com/mozilla-neutrino/neutrino-dev/issues/86) from eliperelman/v5
    Baseline for Neutrino v5
  * Adding rule include and exclude upgrade documentation
  * Adding missing packages to travis cache, removing duplicate yarn install directive
  * Typo
  * Switching clean middleware to use options.root
  * Updating for latest v5 changes
  * add .eslintrc file, eslint fix script. add deps: prettier, prettier-eslint, eslint, eslint-plugin-react. use config from neutrino-preset-mozilla-rpweb
  * Review nits
  * Switching paths to relative
  * Manually caching monorepo package node_modules for travis
  * Attempting to cache packages' node_modules via wildcard
  * Moving peerDeps of deps to devDeps
  * Normalize API paths based on absolute or relative location
  * Upgrading to webpack-chain v3, add more tests for full presets

2017-03-06
==========

  * Cleaning up unused gitignores
  * Pointing package.json respository to tree location

2017-03-05
==========

  * v5 Docs
  * Preparing docs for v5
  * peerDeps and invalid deps
  * Upgrade webpack-chain to v2, add --inspect

2017-03-02
==========

  * Simplify deep picking with pathOr
  * Allow linting overrides to airbnb preset
  * Dynamic import() for Node
  * Adding dynamic import syntax, babel-polyfill by default, devserver port fix
