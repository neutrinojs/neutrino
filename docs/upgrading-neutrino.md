# Upgrading from Neutrino v6 to v7

Neutrino v7 introduces some changes, most of which are from major version bumps of dependent packages.
To upgrade from Neutrino v6 to v7, be sure to check this list for tasks you may need to perform to use
this latest version:

- **BREAKING CHANGE** webpack-chain upgraded to v4. The breakage from this upgrade is the `.noParse` method
which is now a plain shortcut method, allowing you to set any value.
- **BREAKING CHANGE** Webpack upgraded to v3. While most users should need no changes for this upgrade, be
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
