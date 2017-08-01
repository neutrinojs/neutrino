2017-07-31
==========

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
  * Set devServer.publicPath to use output.publicPath ([#177](https://github.com/mozilla-neutrino/neutrino-dev/issues/177))
  * Adding getters and setters for path options, options for middleware ([#176](https://github.com/mozilla-neutrino/neutrino-dev/issues/176))
  * Polyfills ([#173](https://github.com/mozilla-neutrino/neutrino-dev/issues/173))
    * Rdesign Advanced Customization examples to use Neutrino v5 fashion
    * Fix polyfills set to match only supported platforms
    * Remove 'tranform-regenerator' because according to the babel preset debug log it is already included
    * Fix indentation
    * Add VSCode local settings to the ignore list
    * Separate chunk for polyfills

2017-04-06
==========

  * Releasing v5.4.0
  * neutrino-middleware-image-loader: Use svg-url-loader for svg rule ([#171](https://github.com/mozilla-neutrino/neutrino-dev/issues/171))
    * Use svg-url-loader for svgs, since base64ing svgs doesn't make sense.
    * Use 'url' name.

2017-04-05
==========

  * Node.js preset v5.3.1
  * Correct Node.js preset compile target object ([#170](https://github.com/mozilla-neutrino/neutrino-dev/issues/170))
  * Update changelog
  * ESLint middleware docs bug, v5.3.1
  * Fixing incorrect documentation for linting ([#169](https://github.com/mozilla-neutrino/neutrino-dev/issues/169))

2017-04-04
==========

  * Add react router starter and blog post ([#164](https://github.com/mozilla-neutrino/neutrino-dev/issues/164))

2017-04-02
==========

  * Release v5.3.0
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
