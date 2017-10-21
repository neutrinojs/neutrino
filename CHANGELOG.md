2017-10-19
==========

  * Adding docs for hot middleware updates
  * feat(hot): Include NamedModulesPlugin for better developer experience ([#365](https://github.com/mozilla-neutrino/neutrino-dev/issues/365))
    https://webpack.js.org/plugins/named-modules-plugin/ is a recommended plugin to use with HMR and it enables better debug information in the console.
  * fix: Use cheap-module-eval-source-map for faster recompilation ([#366](https://github.com/mozilla-neutrino/neutrino-dev/issues/366))
    https://webpack.js.org/guides/build-performance/ suggests to use `cheap-module-eval-source-map` to improve incremental build speed. This reduces recompilation times by a magnitude on bigger projects.

2017-10-17
==========

  * Release v7.1.10
  * Update to the newest version of html-webpack-template ([#361](https://github.com/mozilla-neutrino/neutrino-dev/issues/361))
    Counter-intuitively the most recent version of the package is actually
    5.6.0, rather than 6.0.0 or 6.0.1 due to a publishing error. See:
    https://github.com/jaketrent/html-webpack-template/issues/59

2017-10-16
==========

  * Release v7.1.3
  * Add eslintrc.js to .npmignore ([#359](https://github.com/mozilla-neutrino/neutrino-dev/issues/359))
    Since it's only used for testing.

2017-10-12
==========

  * Release 7.1.2
  * Remove extra keys that are invalid in eslintrc ([#358](https://github.com/mozilla-neutrino/neutrino-dev/issues/358))

2017-10-09
==========

  * Use latest version of yarn on Travis ([#355](https://github.com/mozilla-neutrino/neutrino-dev/issues/355))
    The only remaining error with oao + recent yarn turned out to be due
    to OOM (https://github.com/guigrpa/oao/issues/51), which can be solved
    by switching to Travis' fully virtualised infra, which has more RAM.
    The `--frozen-lockfile` parameter has also been moved to `.travis.yml`
    so that the lockfiles are still updated when working making changes
    locally.
  * Upgrade oao/yarn and use --frozen-lockfile with oao bootstrap ([#354](https://github.com/mozilla-neutrino/neutrino-dev/issues/354))
    * Upgrades oao to latest (0.10.3).
    * Upgrades yarn to latest version known to work with oao (0.28.4)
    (see https://github.com/guigrpa/oao/issues/51).
    * Uses `--frozen-lockfile` with `oao bootstrap` since the previous
    issues with it appear to be fixed, and using it ensures that the
    `yarn.lock` files under `packages/*/` have been kept in sync with
    `package.json` changes. Fixes [#255](https://github.com/mozilla-neutrino/neutrino-dev/issues/255).
    * Switches the Travis node 6 job from 6.10.3 to latest 6.x (6.11.4).
  * performance hints ([#353](https://github.com/mozilla-neutrino/neutrino-dev/issues/353))
  * Release v7.1.1
  * Hotfix - bump webpack-chain to guard non-defined chainedmap entries

2017-10-05
==========

  * Release 7.1.0
  * Feature: upgrade webpack-chain to use .before() and .after() ([#346](https://github.com/mozilla-neutrino/neutrino-dev/issues/346))
  * Make yarn lint/publish commands work on Windows ([#345](https://github.com/mozilla-neutrino/neutrino-dev/issues/345))
    Even though MSYS2 and related cygwin-based environments for Windows
    understand shebangs, when a package.json script command is run via
    a Windows yarn/npm install, it runs outside of the bash shell and so
    if it's a direct path to a local script (rather than a package in
    `node_modules/.bin/` which already has `.cmd` shims created by yarn),
    it fails with eg:
    ```
    'packages\neutrino\bin\neutrino' is not recognized as an internal or external command,
    operable program or batch file.
    ```
    To make the package.json scripts truly portable, local scripts must
    be explicitly run with `node`:
    http://alan.norbauer.com/articles/cross-platform-nodejs/#Shell-scripts-that-rely-on-Unix-shebangs
  * Preserve ESLint default include when just exclude set ([#344](https://github.com/mozilla-neutrino/neutrino-dev/issues/344))
    Previously if `exclude` was set manually, it would prevent the default
    value for `include` being used. Now consumers of the middleware can
    pass just `exclude` and not have to pass both. See:
    https://github.com/mozilla-neutrino/neutrino-dev/pull/315#discussion_r141779549
    The default include in neutrino-preset-airbnb-base has also been
    removed, since it just duplicated that in neutrino-middleware-eslint.
  * Travis: Document the pinned version of yarn ([#343](https://github.com/mozilla-neutrino/neutrino-dev/issues/343))
    See:
    https://github.com/mozilla-neutrino/neutrino-dev/pull/315#discussion_r141776823
    Also restores the best practices of using `-f` with curl, as well as
    quietening the log spam.

2017-10-02
==========

  * Release 7.0.2
  * Remove unused dependencies ([#339](https://github.com/mozilla-neutrino/neutrino-dev/issues/339))
    * Move preset-airbnb-base dependencies out of middleware-eslint
    The `eslint-config-airbnb-base` and `eslint-plugin-import` packages
    are not used by `neutrino-middleware-eslint` itself, but instead by
    `neutrino-preset-airbnb-base`.
    * Remove unused dependencies
    Of note:
    * `webpack-dev-middleware` can be removed from the karma preset,
    since it's only used by `karma-webpack` which already has it as a
    dependency.
    * `webpack-dev-server` can be removed from the web preset since it's
    a leftover from when `neutrino-middleware-dev-server` was created.
    * the web preset's `core-js` and `babel-polyfill` dependencies are
    leftover from [#315](https://github.com/mozilla-neutrino/neutrino-dev/issues/315).
    Everything else was manually determined to be unused via correlating
    the package list against greps of the source, plus checking that the
    package wasn't a peer dependency of another listed package.
    * Regenerate yarn lockfiles

2017-10-01
==========

  * Fix link to babel-minify-webpack-plugin options ([#340](https://github.com/mozilla-neutrino/neutrino-dev/issues/340))
    Addresses:
    https://github.com/mozilla-neutrino/neutrino-dev/pull/315#discussion_r141777719
  * Lint the JS config files in the root of the repo ([#338](https://github.com/mozilla-neutrino/neutrino-dev/issues/338))
    Previously the `.neutrinorc.js` and `.eslintrc.js` files were not
    being included in the eslint run.

2017-09-29
==========

  * Simplify require_test.js, making it pass on Windows ([#337](https://github.com/mozilla-neutrino/neutrino-dev/issues/337))
    Previously the test would consistently fail on Windows due to it
    attempting to remove the `test-modules` directory before the `chdir()`
    call to reset the working directory. Subsequent runs would additionally
    hit ava test discovery errors due to it seeing the leftover
    `test-modules` directory as a test rather than a fixture.
    Whilst these issues could be fixed by inverting the cleanup order, it
    makes more sense to commit the `test-module` files to the repo rather
    than generate them on the fly. They have been moved under the `fixtures`
    directory to avoid the above ava errors.
    The test cleanup `chdir(cwd)` step has also been removed, since ava runs
    each test file in a new process, meaning no tests will run after it
    anyway.
    Fixes [#336](https://github.com/mozilla-neutrino/neutrino-dev/issues/336).
  * Misc documentation fixes - part 2 ([#335](https://github.com/mozilla-neutrino/neutrino-dev/issues/335))
    * Docs: Stop using a relative URL for the docs contributing links
    Since unlike links pointing at eg API docs, the contributing links
    don't need to stay in sync with the version being browsed. Using
    the same link on both the `packages/` and `docs/` locations reduces
    the diffs considerable when trying to keep the files in sync.
    * Docs: Sync CONTRIBUTING.md with docs/contributing/README.md
    * Docs: Clarify that the static directory is named `static`
    * Docs: Remove trailing whitespace from webpack-chain.md
    * Docs: Restore changes from [#325](https://github.com/mozilla-neutrino/neutrino-dev/issues/325) lost after merge conflicts
    * Docs: Sync the READMEs in docs/ and packages/
    * Docs: Sync the react and web preset feature lists

2017-09-27
==========

  * Configuration docs nits
  * Release v7.0.1
  * Release v7.0.0
  * Upgrading Webpack to v3, merge config as middleware ([#315](https://github.com/mozilla-neutrino/neutrino-dev/issues/315))
    * Upgrading Webpack to v3, merge config as middleware
    * Documentation updates
    * Removing remaining uses of options.static
    * Document Neutrino event mechanisms
    * Lock yarn to oao-compatible version
    * Updating webpack-chain and other external depenencies
    * Switch babel merging out for babel-merge package
    * Adding docs for babel configuration merging for compile loader
    * Be explicit about letting certain build features run in certain environments
    * Updating plugin environments and command execution
    * Module concatenation plugin
    * Removing babel-polyfill as a default entry
    * Switch to BabelMinifyWebpackPlugin
    * Remove default webpack node options
    * Docs about minify breaking change
    * Allow middleware to be reused by allowing option for usage IDs
    * Add feature for --require
    * Run env middleware against process.env as well as api.options.env
    * Upgrading dependencies again
    * Remove configured externals in react preset for React 16
    * Document options.command
    * Switching svg loader from file to url
    * Update webpack-chain docs from @emorley
    * Revert svg loader breaking change docs
    * Post-rebase yarn.lock updates
  * Release v6.2.1
  * Make the lint command check .jsx files too ([#333](https://github.com/mozilla-neutrino/neutrino-dev/issues/333))
    Previously the `neutrino lint` command would only check `.js` files,
    which was inconsistent with the build/start commands, since they use
    `eslint-loader` and so instead use the `test` regex of `/\.(js|jsx)$/`.
    Fixes [#332](https://github.com/mozilla-neutrino/neutrino-dev/issues/332).

2017-09-24
==========

  * Misc documentation fixes ([#325](https://github.com/mozilla-neutrino/neutrino-dev/issues/325))
    * Docs: Sync the READMEs in docs/ and packages/
    Since the content had drifted out of sync.
    * Docs: Use consistent case for Hot Module Replacement
    * Docs: Sync the react and web preset feature lists
    * Docs: Correct the loader name for the 'html' rule
    Since the loader name was changed from `file` to `html` in [#219](https://github.com/mozilla-neutrino/neutrino-dev/issues/219).
    * Docs: Correct the rule name for neutrino-middleware-style-loader
    Since it was changed from `css` to `style` in [#86](https://github.com/mozilla-neutrino/neutrino-dev/issues/86).

2017-09-13
==========

  * Small API docs change to avoid confusion. ([#317](https://github.com/mozilla-neutrino/neutrino-dev/issues/317))
    The API is first assigned to `neutrino`, but the rest of the doc uses `api`, which was seeming to come from nowhere.

2017-09-11
==========

  * Release v6.2.0
  * feat: Allow passing any Jest CLI options to neutrino-jest test task ([#313](https://github.com/mozilla-neutrino/neutrino-dev/issues/313))
    * feat: Allow passing any Jest CLI options to neutrino-jest test task
    Closes [#287](https://github.com/mozilla-neutrino/neutrino-dev/issues/287)
    * docs: Update docs for Jest presets
  * chore: Add lint-staged and husky ([#314](https://github.com/mozilla-neutrino/neutrino-dev/issues/314))
    Add lint-staged with an auto-fix configuration for all JS files.
    See https://github.com/okonet/lint-staged

2017-09-06
==========

  * Release 6.1.8
  * Fixes [#311](https://github.com/mozilla-neutrino/neutrino-dev/issues/311) ([#312](https://github.com/mozilla-neutrino/neutrino-dev/issues/312))

2017-08-30
==========

  * Release 6.1.6

2017-08-29
==========

  * Handle list of errors from test command ([#310](https://github.com/mozilla-neutrino/neutrino-dev/issues/310))

2017-07-31
==========

  * Release 6.1.5
  * Fix hot reload ([#304](https://github.com/mozilla-neutrino/neutrino-dev/issues/304))
    * Fix dev server live reload
    * Remove unused variable
    * Fix lint error
    * Simplify code

2017-07-30
==========

  * Make it more clear what the env plugin can be used for ([#295](https://github.com/mozilla-neutrino/neutrino-dev/issues/295))
  * [windows] fix spawn [..]\mocha ENOENT error ([#298](https://github.com/mozilla-neutrino/neutrino-dev/issues/298))

2017-07-02
==========

  * Fixing broken middleware links

2017-06-28
==========

  * Release v6.1.4
  * Correctly override path options for custom options ([#293](https://github.com/mozilla-neutrino/neutrino-dev/issues/293))
  * Release v6.1.2
  * Add an .npmignore to all packages ([#291](https://github.com/mozilla-neutrino/neutrino-dev/issues/291))
    Excluding the test directory and `yarn.lock` reduces the package
    size significantly (for example 85-90% reduction in both compressed
    and uncompressed size of neutrino-preset-web), plus reduces the
    noise when consumers need to grep their local `node_modules`.
    An `.npmignore` has been used instead of the `files` directive in
    `package.json` since the latter can cause breakage that isn't shown
    in CI if the directory layout changes (which is likely given the
    Neutrino packages have a mixture of using the `src` directory and
    not, depending on how many files they include). `.npmignore` was
    used instead of `.yarnignore` since npm doesn't support the latter
    whereas yarn supports both.

2017-06-22
==========

  * Prevent null chunks from preventing naming ([#284](https://github.com/mozilla-neutrino/neutrino-dev/issues/284))
  * Release v6.1.0
  * Ensure test cases are not run 2x in watch mode. ([#280](https://github.com/mozilla-neutrino/neutrino-dev/issues/280))
  * Karma coverage ([#282](https://github.com/mozilla-neutrino/neutrino-dev/issues/282))
    * Add missing semi-colon in neutrino-preset-karma.
    * Wrap preset-karma loaderMerge call in conditional which only runs when `compile` rule exists.
  * Fix broken link ([#281](https://github.com/mozilla-neutrino/neutrino-dev/issues/281))
  * Add `babel-plugin-istanbul` to ensure accurate coverage is reported. ([#279](https://github.com/mozilla-neutrino/neutrino-dev/issues/279))

2017-06-21
==========

  * Release v6.0.5
  * Hashing entire un-named chunk instead of individual modules ([#278](https://github.com/mozilla-neutrino/neutrino-dev/issues/278))
  * Release v6.0.4

2017-06-20
==========

  * Adding ESLint support back to React ([#275](https://github.com/mozilla-neutrino/neutrino-dev/issues/275))

2017-06-19
==========

  * Add Travis badge to README ([#270](https://github.com/mozilla-neutrino/neutrino-dev/issues/270))
    Also improves mark-up readability (has no effect on display layout).

2017-06-18
==========

  * Release v6.0.3
  * Reject test runners when non-zero exit code ([#269](https://github.com/mozilla-neutrino/neutrino-dev/issues/269))

2017-06-16
==========

  * Correct typo ([#266](https://github.com/mozilla-neutrino/neutrino-dev/issues/266))

2017-06-15
==========

  * Releasing v6.0.2
  * Fixing issues in babel merging and dynamic named chunks ([#264](https://github.com/mozilla-neutrino/neutrino-dev/issues/264))
  * Correct typo ([#261](https://github.com/mozilla-neutrino/neutrino-dev/issues/261))
  * Removing frozen-lockfile...again
  * Updating oao, yarn.lock files, travis installation

2017-06-14
==========

  * Disabling git status checks for now
  * Releasing v6.0.0
  * Yarn lockfile updates
  * v6 ([#254](https://github.com/mozilla-neutrino/neutrino-dev/issues/254))
    * Buffer: true; -> Buffer: false ([#201](https://github.com/mozilla-neutrino/neutrino-dev/issues/201))
    remove not-needed polyfill
    * Buffer: true; -> Buffer: false ([#201](https://github.com/mozilla-neutrino/neutrino-dev/issues/201))
    remove not-needed polyfill
    * V6 dev fast async ([#202](https://github.com/mozilla-neutrino/neutrino-dev/issues/202))
    * 🗼babel fast async to preset-web
    * 🗼babel fast async to preset-node
    * 📦🐈 yarn lock file for preset-node
    * 📦⬆  fast-async semver dep  ⌨️⚒ node v -> string
    * ❎ remove `builtIns: false`
    * 🙃 flip builtIn: true
    * 👕 formatting
    * 💍 fast-async runtimePattern from  📌 entry point
    * 📌 add as entry point instead of regex
    * 🔙💍 update async for node
    * merge after bootstrap again
    * 🚚📌 move entry points to beginning
    * Bugfix/eslint jest rules ([#212](https://github.com/mozilla-neutrino/neutrino-dev/issues/212))
    * Fix ESLint Jest analyze
    * Add SCSS extension to the mocking list
    * Upgrade eslint jest plugin
    * Mark focused test as errors
    * Remove `Buffer` global rule from Web preset for v6
    * Upgrade the package version to v6
    * Upgrade dependencies to v6
    * Switching HTML loader middleware to html-loader ([#219](https://github.com/mozilla-neutrino/neutrino-dev/issues/219))
    * Adding cacheDirectory to compile-loader ([#221](https://github.com/mozilla-neutrino/neutrino-dev/issues/221))
    * Replace events with generic event 'run'
    closes [#166](https://github.com/mozilla-neutrino/neutrino-dev/issues/166)
    * Add additional event run and prerun
    * Inline prerun and run names
    * Bugfix/react set state ([#213](https://github.com/mozilla-neutrino/neutrino-dev/issues/213))
    * Fix `setState()` exception in React
    * Upgrade React preset package version to v6
    * Rollback versions
    * Redesign react babel config
    * Update dependencies to v5
    * Update lock file
    * Add missing dependency
    * Update docs to include the additional run and prerun events ([#224](https://github.com/mozilla-neutrino/neutrino-dev/issues/224))
    * Adding default environment to eslint middleware ([#225](https://github.com/mozilla-neutrino/neutrino-dev/issues/225))
    * Updating Node.js version for Travis CI and removing codecov ([#226](https://github.com/mozilla-neutrino/neutrino-dev/issues/226))
    * Allow environment-specific configuration overrides ([#230](https://github.com/mozilla-neutrino/neutrino-dev/issues/230))
    * Allow environment-specific config override
    * Refine comment
    * Add docs for environment-specific configuration ([#231](https://github.com/mozilla-neutrino/neutrino-dev/issues/231))
    * PWA middleware ([#227](https://github.com/mozilla-neutrino/neutrino-dev/issues/227))
    * Caching based on hashed and inline manifest ([#223](https://github.com/mozilla-neutrino/neutrino-dev/issues/223))
    * Feature/dev server ip ([#204](https://github.com/mozilla-neutrino/neutrino-dev/issues/204))
    * Detect if dev server is public and log the local network IP in the terminal
    * Extract Dev server to a separate middleware
    * Add 'open' option to autostart a default browser
    * Upgrade version
    * Declare dependencies for the dev server middlware
    * Update Webpack Dev Server dependency
    * Correctly handle 'open' option
    * Change the server custom configuration scheme
    * Use 'public' option instead of 'host' for the Dev Server
    * Simplify open browser URL address detection
    * Exclude hot reload functionality from the web preset
    * Finish Dev Server documentatoin
    * Add customization documentation
    * Let dev server middleware to decide when to initialize
    * Fix typos in Docs
    * Make dev server middleware environment independent again
    * Fix versions dependencies
    * Redesign opennning of a browser so that server parameters may be redefined later
    * Move Hot middleware back to Web preset
    * Use Future instead of Promise
    * Fix bugs after refactoring
    * Upgrade dependencies
    * Split settings between the middleware and the preset
    * Fixing missing comma and duplicate package.json entry
    * Move from package.json configuration to .neutrinorc.js ([#233](https://github.com/mozilla-neutrino/neutrino-dev/issues/233))
    * Fixing missing port and https in dev-server
    * Adding transform-class-properties as default babel plugin for react preset ([#234](https://github.com/mozilla-neutrino/neutrino-dev/issues/234))
    * Switching to static directory for non-compiled/copyable assets ([#235](https://github.com/mozilla-neutrino/neutrino-dev/issues/235))
    * Custom commands 😍 ([#236](https://github.com/mozilla-neutrino/neutrino-dev/issues/236))
    * Add api.call for direct use and command execution ([#238](https://github.com/mozilla-neutrino/neutrino-dev/issues/238))
    * Buffer: true; -> Buffer: false ([#201](https://github.com/mozilla-neutrino/neutrino-dev/issues/201))
    remove not-needed polyfill
    * V6 dev fast async ([#202](https://github.com/mozilla-neutrino/neutrino-dev/issues/202))
    * 🗼babel fast async to preset-web
    * 🗼babel fast async to preset-node
    * 📦🐈 yarn lock file for preset-node
    * 📦⬆  fast-async semver dep  ⌨️⚒ node v -> string
    * ❎ remove `builtIns: false`
    * 🙃 flip builtIn: true
    * 👕 formatting
    * 💍 fast-async runtimePattern from  📌 entry point
    * 📌 add as entry point instead of regex
    * 🔙💍 update async for node
    * merge after bootstrap again
    * 🚚📌 move entry points to beginning
    * Bugfix/eslint jest rules ([#212](https://github.com/mozilla-neutrino/neutrino-dev/issues/212))
    * Fix ESLint Jest analyze
    * Add SCSS extension to the mocking list
    * Upgrade eslint jest plugin
    * Mark focused test as errors
    * Remove `Buffer` global rule from Web preset for v6
    * Upgrade the package version to v6
    * Upgrade dependencies to v6
    * Switching HTML loader middleware to html-loader ([#219](https://github.com/mozilla-neutrino/neutrino-dev/issues/219))
    * Adding cacheDirectory to compile-loader ([#221](https://github.com/mozilla-neutrino/neutrino-dev/issues/221))
    * Replace events with generic event 'run'
    closes [#166](https://github.com/mozilla-neutrino/neutrino-dev/issues/166)
    * Add additional event run and prerun
    * Inline prerun and run names
    * Adding default environment to eslint middleware ([#225](https://github.com/mozilla-neutrino/neutrino-dev/issues/225))
    * Updating Node.js version for Travis CI and removing codecov ([#226](https://github.com/mozilla-neutrino/neutrino-dev/issues/226))
    * Update docs to include the additional run and prerun events ([#224](https://github.com/mozilla-neutrino/neutrino-dev/issues/224))
    * Bugfix/react set state ([#213](https://github.com/mozilla-neutrino/neutrino-dev/issues/213))
    * Fix `setState()` exception in React
    * Upgrade React preset package version to v6
    * Rollback versions
    * Redesign react babel config
    * Update dependencies to v5
    * Update lock file
    * Add missing dependency
    * Allow environment-specific configuration overrides ([#230](https://github.com/mozilla-neutrino/neutrino-dev/issues/230))
    * Allow environment-specific config override
    * Refine comment
    * Add docs for environment-specific configuration ([#231](https://github.com/mozilla-neutrino/neutrino-dev/issues/231))
    * PWA middleware ([#227](https://github.com/mozilla-neutrino/neutrino-dev/issues/227))
    * Caching based on hashed and inline manifest ([#223](https://github.com/mozilla-neutrino/neutrino-dev/issues/223))
    * Feature/dev server ip ([#204](https://github.com/mozilla-neutrino/neutrino-dev/issues/204))
    * Detect if dev server is public and log the local network IP in the terminal
    * Extract Dev server to a separate middleware
    * Add 'open' option to autostart a default browser
    * Upgrade version
    * Declare dependencies for the dev server middlware
    * Update Webpack Dev Server dependency
    * Correctly handle 'open' option
    * Change the server custom configuration scheme
    * Use 'public' option instead of 'host' for the Dev Server
    * Simplify open browser URL address detection
    * Exclude hot reload functionality from the web preset
    * Finish Dev Server documentatoin
    * Add customization documentation
    * Let dev server middleware to decide when to initialize
    * Fix typos in Docs
    * Make dev server middleware environment independent again
    * Fix versions dependencies
    * Redesign opennning of a browser so that server parameters may be redefined later
    * Move Hot middleware back to Web preset
    * Use Future instead of Promise
    * Fix bugs after refactoring
    * Upgrade dependencies
    * Split settings between the middleware and the preset
    * Fixing missing comma and duplicate package.json entry
    * Move from package.json configuration to .neutrinorc.js ([#233](https://github.com/mozilla-neutrino/neutrino-dev/issues/233))
    * Fixing missing port and https in dev-server
    * Adding transform-class-properties as default babel plugin for react preset ([#234](https://github.com/mozilla-neutrino/neutrino-dev/issues/234))
    * Switching to static directory for non-compiled/copyable assets ([#235](https://github.com/mozilla-neutrino/neutrino-dev/issues/235))
    * Custom commands 😍 ([#236](https://github.com/mozilla-neutrino/neutrino-dev/issues/236))
    * Add api.call for direct use and command execution ([#238](https://github.com/mozilla-neutrino/neutrino-dev/issues/238))
    * Updating yarn.lock
    * Upgrading outdated dependencies ([#240](https://github.com/mozilla-neutrino/neutrino-dev/issues/240))
    * Upgrading v6 dependencies, part 2 ([#245](https://github.com/mozilla-neutrino/neutrino-dev/issues/245))
    * CLI: register before run; CLI: add --quiet; API: run registered command ([#247](https://github.com/mozilla-neutrino/neutrino-dev/issues/247))
    * v6 documentation changes ([#252](https://github.com/mozilla-neutrino/neutrino-dev/issues/252))
    * v6 documentation changes
    * Updating middleware documentation for v6 changes
    * v6 customization docs
    * v6 docs for Jest and Airbnb presets
    * Karma preset v6 documentation updates
    * Mocha preset documentation updates
    * Node.js preset v6 docs updates
    * React preset v6 docs updates
    * v6 docs for Web preset and dev middleware
    * Conditional config overrides
    * Remove travis cache ([#253](https://github.com/mozilla-neutrino/neutrino-dev/issues/253))
    * Adding rudimentary tests to all packages ([#256](https://github.com/mozilla-neutrino/neutrino-dev/issues/256))
    * Buffer: true; -> Buffer: false ([#201](https://github.com/mozilla-neutrino/neutrino-dev/issues/201))
    remove not-needed polyfill
    * V6 dev fast async ([#202](https://github.com/mozilla-neutrino/neutrino-dev/issues/202))
    * 🗼babel fast async to preset-web
    * 🗼babel fast async to preset-node
    * 📦🐈 yarn lock file for preset-node
    * 📦⬆  fast-async semver dep  ⌨️⚒ node v -> string
    * ❎ remove `builtIns: false`
    * 🙃 flip builtIn: true
    * 👕 formatting
    * 💍 fast-async runtimePattern from  📌 entry point
    * 📌 add as entry point instead of regex
    * 🔙💍 update async for node
    * merge after bootstrap again
    * 🚚📌 move entry points to beginning
    * Switching HTML loader middleware to html-loader ([#219](https://github.com/mozilla-neutrino/neutrino-dev/issues/219))
    * Adding cacheDirectory to compile-loader ([#221](https://github.com/mozilla-neutrino/neutrino-dev/issues/221))
    * Replace events with generic event 'run'
    closes [#166](https://github.com/mozilla-neutrino/neutrino-dev/issues/166)
    * Add additional event run and prerun
    * Inline prerun and run names
    * Adding default environment to eslint middleware ([#225](https://github.com/mozilla-neutrino/neutrino-dev/issues/225))
    * Updating Node.js version for Travis CI and removing codecov ([#226](https://github.com/mozilla-neutrino/neutrino-dev/issues/226))
    * Update docs to include the additional run and prerun events ([#224](https://github.com/mozilla-neutrino/neutrino-dev/issues/224))
    * Bugfix/eslint jest rules ([#212](https://github.com/mozilla-neutrino/neutrino-dev/issues/212))
    * Fix ESLint Jest analyze
    * Add SCSS extension to the mocking list
    * Upgrade eslint jest plugin
    * Mark focused test as errors
    * Remove `Buffer` global rule from Web preset for v6
    * Upgrade the package version to v6
    * Upgrade dependencies to v6
    * Bugfix/react set state ([#213](https://github.com/mozilla-neutrino/neutrino-dev/issues/213))
    * Fix `setState()` exception in React
    * Upgrade React preset package version to v6
    * Rollback versions
    * Redesign react babel config
    * Update dependencies to v5
    * Update lock file
    * Add missing dependency
    * Allow environment-specific configuration overrides ([#230](https://github.com/mozilla-neutrino/neutrino-dev/issues/230))
    * Allow environment-specific config override
    * Refine comment
    * Add docs for environment-specific configuration ([#231](https://github.com/mozilla-neutrino/neutrino-dev/issues/231))
    * PWA middleware ([#227](https://github.com/mozilla-neutrino/neutrino-dev/issues/227))
    * V6 dev fast async ([#202](https://github.com/mozilla-neutrino/neutrino-dev/issues/202))
    * 🗼babel fast async to preset-web
    * 🗼babel fast async to preset-node
    * 📦🐈 yarn lock file for preset-node
    * 📦⬆  fast-async semver dep  ⌨️⚒ node v -> string
    * ❎ remove `builtIns: false`
    * 🙃 flip builtIn: true
    * 👕 formatting
    * 💍 fast-async runtimePattern from  📌 entry point
    * 📌 add as entry point instead of regex
    * 🔙💍 update async for node
    * merge after bootstrap again
    * 🚚📌 move entry points to beginning
    * Bugfix/eslint jest rules ([#212](https://github.com/mozilla-neutrino/neutrino-dev/issues/212))
    * Fix ESLint Jest analyze
    * Add SCSS extension to the mocking list
    * Upgrade eslint jest plugin
    * Mark focused test as errors
    * Remove `Buffer` global rule from Web preset for v6
    * Upgrade the package version to v6
    * Upgrade dependencies to v6
    * Caching based on hashed and inline manifest ([#223](https://github.com/mozilla-neutrino/neutrino-dev/issues/223))
    * Feature/dev server ip ([#204](https://github.com/mozilla-neutrino/neutrino-dev/issues/204))
    * Detect if dev server is public and log the local network IP in the terminal
    * Extract Dev server to a separate middleware
    * Add 'open' option to autostart a default browser
    * Upgrade version
    * Declare dependencies for the dev server middlware
    * Update Webpack Dev Server dependency
    * Correctly handle 'open' option
    * Change the server custom configuration scheme
    * Use 'public' option instead of 'host' for the Dev Server
    * Simplify open browser URL address detection
    * Exclude hot reload functionality from the web preset
    * Finish Dev Server documentatoin
    * Add customization documentation
    * Let dev server middleware to decide when to initialize
    * Fix typos in Docs
    * Make dev server middleware environment independent again
    * Fix versions dependencies
    * Redesign opennning of a browser so that server parameters may be redefined later
    * Move Hot middleware back to Web preset
    * Use Future instead of Promise
    * Fix bugs after refactoring
    * Upgrade dependencies
    * Split settings between the middleware and the preset
    * Fixing missing comma and duplicate package.json entry
    * Move from package.json configuration to .neutrinorc.js ([#233](https://github.com/mozilla-neutrino/neutrino-dev/issues/233))
    * Fixing missing port and https in dev-server
    * Adding transform-class-properties as default babel plugin for react preset ([#234](https://github.com/mozilla-neutrino/neutrino-dev/issues/234))
    * Switching to static directory for non-compiled/copyable assets ([#235](https://github.com/mozilla-neutrino/neutrino-dev/issues/235))
    * Custom commands 😍 ([#236](https://github.com/mozilla-neutrino/neutrino-dev/issues/236))
    * Add api.call for direct use and command execution ([#238](https://github.com/mozilla-neutrino/neutrino-dev/issues/238))
    * Adding default environment to eslint middleware ([#225](https://github.com/mozilla-neutrino/neutrino-dev/issues/225))
    * Bugfix/react set state ([#213](https://github.com/mozilla-neutrino/neutrino-dev/issues/213))
    * Fix `setState()` exception in React
    * Upgrade React preset package version to v6
    * Rollback versions
    * Redesign react babel config
    * Update dependencies to v5
    * Update lock file
    * Add missing dependency
    * PWA middleware ([#227](https://github.com/mozilla-neutrino/neutrino-dev/issues/227))
    * Caching based on hashed and inline manifest ([#223](https://github.com/mozilla-neutrino/neutrino-dev/issues/223))
    * Feature/dev server ip ([#204](https://github.com/mozilla-neutrino/neutrino-dev/issues/204))
    * Detect if dev server is public and log the local network IP in the terminal
    * Extract Dev server to a separate middleware
    * Add 'open' option to autostart a default browser
    * Upgrade version
    * Declare dependencies for the dev server middlware
    * Update Webpack Dev Server dependency
    * Correctly handle 'open' option
    * Change the server custom configuration scheme
    * Use 'public' option instead of 'host' for the Dev Server
    * Simplify open browser URL address detection
    * Exclude hot reload functionality from the web preset
    * Finish Dev Server documentatoin
    * Add customization documentation
    * Let dev server middleware to decide when to initialize
    * Fix typos in Docs
    * Make dev server middleware environment independent again
    * Fix versions dependencies
    * Redesign opennning of a browser so that server parameters may be redefined later
    * Move Hot middleware back to Web preset
    * Use Future instead of Promise
    * Fix bugs after refactoring
    * Upgrade dependencies
    * Split settings between the middleware and the preset
    * Fixing missing comma and duplicate package.json entry
    * Move from package.json configuration to .neutrinorc.js ([#233](https://github.com/mozilla-neutrino/neutrino-dev/issues/233))
    * Adding transform-class-properties as default babel plugin for react preset ([#234](https://github.com/mozilla-neutrino/neutrino-dev/issues/234))
    * Switching to static directory for non-compiled/copyable assets ([#235](https://github.com/mozilla-neutrino/neutrino-dev/issues/235))
    * Custom commands 😍 ([#236](https://github.com/mozilla-neutrino/neutrino-dev/issues/236))
    * Upgrading outdated dependencies ([#240](https://github.com/mozilla-neutrino/neutrino-dev/issues/240))
    * Upgrading v6 dependencies, part 2 ([#245](https://github.com/mozilla-neutrino/neutrino-dev/issues/245))
    * CLI: register before run; CLI: add --quiet; API: run registered command ([#247](https://github.com/mozilla-neutrino/neutrino-dev/issues/247))
    * v6 documentation changes ([#252](https://github.com/mozilla-neutrino/neutrino-dev/issues/252))
    * v6 documentation changes
    * Updating middleware documentation for v6 changes
    * v6 customization docs
    * v6 docs for Jest and Airbnb presets
    * Karma preset v6 documentation updates
    * Mocha preset documentation updates
    * Node.js preset v6 docs updates
    * React preset v6 docs updates
    * v6 docs for Web preset and dev middleware
    * Conditional config overrides
    * Remove travis cache ([#253](https://github.com/mozilla-neutrino/neutrino-dev/issues/253))
    * Adding rudimentary tests to all packages ([#256](https://github.com/mozilla-neutrino/neutrino-dev/issues/256))
    * Switch fast-async to spec mode ([#258](https://github.com/mozilla-neutrino/neutrino-dev/issues/258))
    * Fail CI if git status is unclean

2017-06-12
==========

  * Changelog
  * Document conditional configuration ([#250](https://github.com/mozilla-neutrino/neutrino-dev/issues/250))
    * Document conditional configuration
    * Switch 'blows up' to 'throws an exception'
    * Document the Web preset w.r.t conditional configs
    * Document the Node preset w.r.t conditional changes
    In addition, I added an entry for `hot` to the list of plugins.
  * Switch Travis runs from Ubuntu Precise to Trusty ([#249](https://github.com/mozilla-neutrino/neutrino-dev/issues/249))
    See:
    https://docs.travis-ci.com/user/trusty-ci-environment/
    This also fixes the warning about not using a C++11 compiler:
    https://docs.travis-ci.com/user/languages/javascript-with-nodejs#Node.js-v4-(or-io.js-v3)-compiler-requirements
    Note this intentionally isn't switching to their container based
    infra, since whilst it has faster boot times, these jobs still take
    longer at the moment, due to the lower CPU/RAM allowances. If [#248](https://github.com/mozilla-neutrino/neutrino-dev/issues/248)
    manages to improve the overall runtime this may be worth revisiting.

2017-06-11
==========

  * Test against Node.js 8 on Travis ([#246](https://github.com/mozilla-neutrino/neutrino-dev/issues/246))

2017-06-09
==========

  * Releasing Jest preset v5.9.1
  * Hotfix/neutrino preset jest/relative alias handling ([#243](https://github.com/mozilla-neutrino/neutrino-dev/issues/243))
    * Check whether path is relative, and add wildcard suffix to catch nested path resolutions
    * lint errors
    * use path.isAbsolute and string.startsWith

2017-06-02
==========

  * Add description how to ignore files in an IDE lint ([#205](https://github.com/mozilla-neutrino/neutrino-dev/issues/205))
    * Add description how to ignore files in an IDE lint
    * Rewrite ESLint ignore documentation
    * Duplicate ESLint ignore reference in docs
    * Change Neutrino configuration naming

2017-05-31
==========

  * Releasing node preset v5.9.1
  * Use string version of specifying target ([#217](https://github.com/mozilla-neutrino/neutrino-dev/issues/217))
    I get the following, very annoying, warning when building. This change fixes it.
    ```
    Warning, the following targets are using a decimal version:
    node: 6.9
    We recommend using a string for minor/patch versions to avoid numbers like 6.10
    getting parsed as 6.1, which can lead to unexpected behavior.
    ```

2017-05-25
==========

  * Releasing v5.9.0
  * Use absolute paths in package readme
  * Docs for --debug
  * add option for node debugging ([#215](https://github.com/mozilla-neutrino/neutrino-dev/issues/215))
    * add neutrino.options.debug via --debug flag
    * use start server with inspect conditionally
    * improve codestyle for node debug option

2017-05-18
==========

  * Fix error in test usage example ([#209](https://github.com/mozilla-neutrino/neutrino-dev/issues/209))

2017-05-09
==========

  * README update

2017-05-01
==========

  * Releasing v5.8.0
  * Feature/universal entry ([#195](https://github.com/mozilla-neutrino/neutrino-dev/issues/195))
    * Remove file extension
    * Update docs
    * Update the deafult 'entry' test

2017-04-27
==========

  * Indent to clarify context change ([#191](https://github.com/mozilla-neutrino/neutrino-dev/issues/191))

2017-04-24
==========

  * Release v5.7.0
  * Simplify error logging. ([#148](https://github.com/mozilla-neutrino/neutrino-dev/issues/148))
    * Bump webpack version to "^2.4.1"
    * Simplify error logging

2017-04-23
==========

  * Fixing typo in karma docs
  * Fix typo in preset name ([#190](https://github.com/mozilla-neutrino/neutrino-dev/issues/190))

2017-04-17
==========

  * Release v5.6.0
  * Merge branch 'master' of github.com:mozilla-neutrino/neutrino-dev
  * Refactoring minify plugin options

2017-04-14
==========

  * Setting devServer publicPath to / ([#179](https://github.com/mozilla-neutrino/neutrino-dev/issues/179))
  * Consider case when 'core-js' is located in 'babel-polyfill' root ([#181](https://github.com/mozilla-neutrino/neutrino-dev/issues/181))
    * Rdesign Advanced Customization examples to use Neutrino v5 fashion
    * Fix cases when there are several 'core-js' instances in the project
    * Add 'core-js' alias and lock 'babel-polyfill' version
    * Spaces instead of tabs
    * Use `dirname` instead of `join`
    * Correct hierarchy indentation

2017-04-11
==========

  * v5.5.0 -> v5.5.1
