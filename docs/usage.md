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
typical recommendations for script target names, you may choose a different name if necessary
for your project.

## Building for development

Neutrino provides the command `neutrino start` for creating a bundle during development. Using
`neutrino start` sets the Node.js environment to `development` using the `NODE_ENV` environment variable,
which is available in your project source code. Depending on the preset you are using, `neutrino start`
may also spin up a development server with hot module reloading capabilities.
Check your preset for details.

Usage:

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
neutrino start --preset PRESET_MODULE
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
which is available in your project source code.

```bash
# PRESET_MODULE is the name of the preset to build with, e.g. neutrino-preset-react
neutrino build --preset PRESET_MODULE
```

Putting this into your `package.json` will allow you to build your project using either
`yarn start` or `npm start`. Using `neutrino-preset-react` as an example:

```json
{
  "scripts": {
    "start": "neutrino build --preset neutrino-preset-react"
  }
}
```

## Building and running tests

Neutrino provides the command `neutrino test` for creating a production bundle for use in executing tests.
Using `neutrino test` sets the Node.js environment variable to `test` using the `NODE_ENV` environment
variable, which is available in your project source code.



## Default project layout
