# Usage

Neutrino is a configuration management tool for the webpack ecosystem that supports building, testing,
linting, and developing JavaScript projects based on shared configuration presets and middleware.
You can use Neutrino within your project alongside webpack, ESLint, Jest, Karma, and more of your
favorite CLI tools, preferably using scripts defined in your project's `package.json`.

## Setup

After completing the [installation](./installation/index.md) of Neutrino and any Neutrino presets or
middleware, you will need to create a `.neutrinorc.js` file to control its options and tell your project
which middleware to load when building and performing various related tasks. The recommended approach
is to export an object with a root directory option and the middleware you have installed.

_Example: create a baseline `.neutrinorc.js` file for a React project:_

```js
// .neutrinorc.js
const react = require('@neutrinojs/react');

module.exports = {
  options: {
    root: __dirname
  },
  use: [
    react()
  ]
};
```

Next you will want to define some scripts in your project's `package.json` in order to more
easily interact with your project. In a typical project:

- `scripts.start` would be the command you wish to run during development
- `scripts.build` would be the command you wish to run to create a production bundle
- `scripts.test` would be the command you wish to run to execute tests

Using these script targets may not be suitable for every project. They are only the
typical recommendations for script target names. You may choose different names if desired.

## Building for development

Webpack's CLI tools provide commands for creating or starting a bundle during development, and vary
depending on whether you are targeting a browser or Node.js. For example, if working on a web project,
you would typically install `webpack`, `webpack-cli`, and `webpack-dev-server` and call the latter during
development. For Node.js, you would typically install `webpack` and `webpack-cli`, and call `webpack` from
scripts during development. Check the documentation of your preset for details on the recommended installation
instructions to build your project for development.

Example usage:

```bash
webpack-dev-server --mode development --open
```

Putting this into your `package.json` will allow you to build your project using either
`yarn start` or `npm start`.

```json
{
  "scripts": {
    "start": "webpack-dev-server --mode development --open"
  }
}
```

To tell `webpack` or `webpack-dev-server` to load Neutrino middleware or presets for
its configuration, create a `webpack.config.js` in the root of the project with the
following:

```js
// webpack.config.js
const neutrino = require('neutrino');

module.exports = neutrino().webpack();
```

This will cause Neutrino to load all middleware and options defined in the project's
`.neutrinorc.js` file then turn it into a configuration format suitable for consumption
by webpack.

## Building for production

Webpack's CLI tools provide commands for creating a production bundle. You should
have `webpack` and `webpack-cli` installed to run this build. Check the documentation of your preset
for details on the recommended installation instructions to build your project for production.
If you do not specify a `NODE_ENV` environment variable, Neutrino will default it to `production`
when used with webpack's `--mode production`.

Example usage:

```bash
webpack --mode production
```

Putting this into your `package.json` will allow you to build your project using either
`yarn build` or `npm run build`.

```json
{
  "scripts": {
    "build": "webpack --mode production"
  }
}
```

To tell `webpack` to load Neutrino middleware or presets for its configuration, create a
`webpack.config.js` in the root of the project with the following:

```js
// webpack.config.js
const neutrino = require('neutrino');

module.exports = neutrino().webpack();
```

This will cause Neutrino to load all middleware and options defined in the project's
`.neutrinorc.js` file then turn it into a configuration format suitable for consumption
by webpack.

## Building and running tests

Various test runners support using compiled webpack code to drive tests, but may
be difficult to integrate with webpack, and Neutrino helps alleviate this.
Check the documentation of your particular test runner preset
for details on the recommended installation instructions to test your project.
There should be an associated test runner tool to install alongside your middleware, e.g.
`@neutrinojs/jest` will require a Jest installation, `@neutrinojs/karma` will require a
Karma installation, and `@neutrinojs/mocha` will require a Mocha installation.

Example Jest usage:

```bash
jest
```

Putting this into your `package.json` will allow you to test your project using either
`yarn test` or `npm test`. You can also add commands for watching your tests.

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

To tell `jest` to load Neutrino middleware or presets for its configuration, create a
`jest.config.js` in the root of the project with the following:

```js
// jest.config.js
const neutrino = require('neutrino');

// Set a default NODE_ENV before loading any middleware
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

module.exports = neutrino().jest();
```

This will cause Neutrino to load all middleware and options defined in the project's
`.neutrinorc.js` file then turn it into a configuration format suitable for consumption
by Jest.

## Linting with ESLint

ESLint's CLI tool can lint your project in addition to development-time hints when used
with `@neutrinojs/eslint` or its dependent presets. You should have `eslint` installed in order
to run the ESLint CLI tool. Check the documentation of your linting preset for details
on the recommended installation instructions to lint your project.

Example usage:

```bash
eslint --cache --format codeframe --ext mjs,jsx,js src
```

Putting this into your `package.json` will allow you to lint your project using either
`yarn lint` or `npm run lint`. You can also add commands to automatically apply fixes
if desired.

```json
{
  "scripts": {
    "lint": "eslint --cache --format codeframe --ext mjs,jsx,js src",
    "lint:fix": "yarn lint --fix"
  }
}
```

Note: When using npm any options must be preceeded with `--`, so the `lint:fix` command
becomes `"npm run lint -- --fix"`.

To tell ESLint to load Neutrino middleware or presets for its configuration, create a
`.eslintrc.js` file in the root of the project with the following:

```js
// .eslintrc.js
const neutrino = require('neutrino');

module.exports = neutrino().eslintrc();
```

This will cause Neutrino to load all middleware and options defined in the project's
`.neutrinorc.js` file then turn it into a configuration format suitable for consumption
by ESLint's CLI.

## Using multiple presets

Neutrino supports loading multiple presets and middleware using the `use` property in a
`.neutrinorc.js` file. By specifying a `use` array, every Neutrino output function will look up which middleware
are configured in your in `.neutrinorc.js`.

```js
// package.json
{
  "scripts": {
    "start": "webpack-dev-server --mode development --open",
    "build": "webpack --mode production",
    "test": "jest"
  }
}
```

```js
// .neutrinorc.js
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');

module.exports = {
  use: [
    react(),
    jest()
  ]
}
```

## Generating multiple builds

Webpack supports the ability to run multiple builds by exporting an array of
configurations instead of a single configuration. You can also use Neutrino to
drive this process by exporting multiple Neutrino configuration outputs from a
`webpack.config.js` or by calling `webpack` multiple times.

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

## Inspecting the generated webpack config

The `neutrino --inspect` command can be used to write out a stringified version of the generated
webpack configuration to stdout. Use the `--mode` flag or the `NODE_ENV` environment variable to
control which variation of the configuration is output.

For example:

```bash
neutrino --inspect --mode {production,development}
```

Or:

```bash
NODE_ENV={production,development,test} neutrino --inspect
```

If your Neutrino configuration file is not named `.neutrinojs.js`, specify the filename using `--config`. For example:

```bash
neutrino --inspect --mode {production,development} --config .custom.neutrino.config.js
```

As of Neutrino 9, the `--inspect` output when using the official presets is now sufficiently
self-contained that it can be passed to webpack with no additional changes required.

For example:

```bash
echo "module.exports = $(yarn neutrino --inspect --mode production);" > exported-config.js
yarn webpack --config exported-config.js
```
