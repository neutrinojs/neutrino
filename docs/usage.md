# Usage

Neutrino is a command-line tool that wraps Webpack in order to support building JavaScript projects
based on shared configuration presets and middleware. You can use Neutrino within your project, preferably using
scripts defined in your project's `package.json`.

## Setup

After completing the [installation](./installation.md) of Neutrino and your Neutrino preset, you will
want to define some scripts in your project's `package.json` in order to more simply build your project.
In a typical project:

- `scripts.start` would be the command you wish to run during development
- `scripts.build` would be the command you wish to run to create a production bundle
- `scripts.test` would be the command you wish to run to execute tests

Using these script targets may not be suitable for every project. They are only the
typical recommendations for script target names. You may choose any different name if desired
for your project.

## Building for development

Neutrino provides the command `neutrino start` for creating a bundle during development. Using
`neutrino start` by default sets the Node.js environment to `development` using the `NODE_ENV` environment variable,
which is available in your project source code. Depending on the presets you are using, `neutrino start`
may also spin up a development server with Hot Module Replacement (HMR) capabilities.
Check the documentation of your preset for details.

Usage:

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
neutrino start --use PRESET_MODULE
```

Putting this into your `package.json` will allow you to build your project using either
`yarn start` or `npm start`. Using `neutrino-preset-react` as an example:

```json
{
  "scripts": {
    "start": "neutrino start --use neutrino-preset-react"
  }
}
```

## Building for production

Neutrino provides the command `neutrino build` for creating a bundle for production deployment.
Using `neutrino build` by default sets the Node.js environment to `production` using the `NODE_ENV` environment variable,
which is available in your project source code. See the documentation for your preset for details regarding additional
steps after your build is completed.

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
neutrino build --use PRESET_MODULE
```

Putting this into your `package.json` will allow you to build your project using either
`yarn build` or `npm run build`. Using `neutrino-preset-react` as an example:

```json
{
  "scripts": {
    "build": "neutrino build --use neutrino-preset-react"
  }
}
```

## Building and running tests

Neutrino provides the command `neutrino test` for invoking a set of tests included in your project.
Using `neutrino test` by default sets the Node.js environment variable to `test` using the `NODE_ENV` environment
variable, which is available in your project source code. How your source code is built and consumed from tests
is determined by the middleware you are using. Running suites that are built the same as source files is encouraged by
using Neutrino-compatible middleware. Neutrino currently provides three core testing presets: Karma, Jest, and Mocha.

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
# TESTING_MODULE is the name of another middleware to build with, e.g. neutrino-preset-karma
neutrino test --use PRESET_MODULE TESTING_MODULE
```

Putting this into your `package.json` will allow you to test your project using either
`yarn test` or `npm test`. Using `neutrino-preset-react` and `neutrino-preset-karma` as an example:

```json
{
  "scripts": {
    "test": "neutrino test --use neutrino-preset-react neutrino-preset-karma"
  }
}
```

Using the command `neutrino test` will execute every test file located in your
[testing directory](./project-layout#Testing). You may also provide to this command the specific test files you wish
to run individually. It is important to note that when combined with the `--use` parameter, you should use two
dashes after the last middleware to denote the end of the middleware and the beginning of the test files.

```bash
neutrino test --use PRESET_A PRESET_B -- a_test.js b_test.js
```

## Using multiple presets

All Neutrino commands support the `--use` command line parameter, but having to specify this for each script target
can be cumbersome and verbose, especially if you have many middleware or presets. Fortunately, Neutrino also supports
specifying presets using the `use` property in a `.neutrinorc.js` file. By omitting the `--use`
flag and specifying a `use` array, every call to a Neutrino command will look up which middleware
are configured in your in `.neutrinorc.js`.

This is the recommended approach when using more than one preset/middleware.

```js
// package.json
{
  "scripts": {
    "start": "neutrino start",
    "build": "neutrino build",
    "test": "neutrino test"
  }
}
```

```js
// .neutrinorc.js
module.exports = {
  use: [
    'neutrino-preset-react',
    'neutrino-preset-karma'
  ]
}
```
