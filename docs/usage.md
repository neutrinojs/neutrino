# Usage

Neutrino is a command-line tool that wraps Webpack in order to support building JavaScript projects
based on shared configuration presets. You can use Neutrino within your project, preferably using
scripts defined in your project's `package.json`.

## Setup

After completing the [installation](/installation.md) of Neutrino and your Neutrino preset, you will
want to define some scripts in your project's `package.json` in order to simply build your project.
In a typical project:

- `scripts.start` would be the command you wish to run during development
- `scripts.build` would be the command you wish to run to create a production bundle
- `scripts.test` would be the command you wish to run to execute tests

Using these script targets may not be suitable for every project; know that they are just
typical recommendations for script target names, you may choose a different name if desired
for your project.

## Building for development

Neutrino provides the command `neutrino start` for creating a bundle during development. Using
`neutrino start` sets the Node.js environment to `development` using the `NODE_ENV` environment variable,
which is available in your project source code. Depending on the presets you are using, `neutrino start`
may also spin up a development server with hot module reloading capabilities.
Check the documentation of your preset for details.

Usage:

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
neutrino start --presets PRESET_MODULE
```

Putting this into your `package.json` will allow you to build your project using either
`yarn start` or `npm start`. Using `neutrino-preset-react` as an example:

```json
{
  "scripts": {
    "start": "neutrino start --preset neutrino-preset-react"
  }
}
```

## Building for production

Neutrino provides the command `neutrino build` for creating a bundle for production deployment.
Using `neutrino build` sets the Node.js environment to `production` using the `NODE_ENV` environment variable,
which is available in your project source code. See the documentation for your preset for details regarding additional
steps after your build is completed.

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
neutrino build --presets PRESET_MODULE
```

Putting this into your `package.json` will allow you to build your project using either
`yarn build` or `npm run build`. Using `neutrino-preset-react` as an example:

```json
{
  "scripts": {
    "build": "neutrino build --presets neutrino-preset-react"
  }
}
```

## Building and running tests

Neutrino provides the command `neutrino test` for invoking a set of tests included in your project.
Using `neutrino test` sets the Node.js environment variable to `test` using the `NODE_ENV` environment
variable, which is available in your project source code. How your source code is built and consumed from tests
is determined by the preset your are using. Running suites that are built the same as source files are encouraged
to use a Neutrino-compatible preset. Neutrino currently provides three core testing presets: Karma, Jest, and Mocha.

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
# TESTING_MODULE is the name of another preset to build with, e.g. neutrino-preset-karma
neutrino build --presets PRESET_MODULE TESTING_MODULE
```

Putting this into your `package.json` will allow you to test your project using either
`yarn test` or `npm test`. Using `neutrino-preset-react` and `neutrino-preset-karma` as an example:

```json
{
  "scripts": {
    "test": "neutrino test --presets neutrino-preset-react neutrino-preset-karma"
  }
}
```

Using the command `neutrino test` will execute every test file located in your
[testing directory](/project-layout#Testing). You may also provide to this command the specific test files you wish
to run individually. It is important to note that when combined with the `--presets` parameter, you should use two
dashes after the last preset to denote the end of the presets and the beginning of the test files.

```bash
neutrino test --presets PRESET_A PRESET_B -- a_test.js b_test.js
```

## Using multiple presets

All Neutrino commands support the `--presets` command line parameter, but having to specify this for each script target
can be cumbersome, especially if you have many presets. Fortunately Neutrino also supports specifying presets using the
`config.presets` field in your project's package.json file. By omitting the `--presets` flag and specifying a
`config.presets` array, every call to a Neutrino command will look up which presets are configured in your package.json.

```json
{
  "config": {
    "presets": [
      "neutrino-preset-react",
      "neutrino-preset-karma"
    ]
  },
  "scripts": {
    "start": "neutrino start",
    "build": "neutrino build",
    "test": "neutrino test"
  }
}
```
