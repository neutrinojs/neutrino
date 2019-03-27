# Scaffold a Neutrino Project

Neutrino can help you quickly start new projects by scaffolding your initial
project structure. `@neutrinojs/create-project` uses middleware and presets
behind the scene to build projects. If you are not familiar with them, take a
moment to explore [middleware](https://neutrinojs.org/middleware/) and
[presets](https://neutrinojs.org/presets/).

[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url]

## Getting Started

Run the following command to start the process. Substitute `<directory-name>`
with the directory name you wish to create for this project.

### Yarn

```
❯ yarn create @neutrinojs/project <directory-name>
```

_Note: The `create` command is a shorthand that helps you do two things at once.
See the [Yarn create docs](https://yarnpkg.com/lang/en/docs/cli/create/) for
more details._

### npm/npx

```
❯ npx @neutrinojs/create-project <directory-name>
```

## Available Projects

`@neutrinojs/create-project` presently offers a scaffolding project to build an
application, a library, or components. Depending on the project type, the CLI
helper may offer different flavors of that project to scaffold. Each project
type harnesses the power of middleware or presets to configure itself.

| Project          | Project Type | Middleware                                                                          |
| ---------------- | ------------ | ----------------------------------------------------------------------------------- |
| React            | Application  | [`@neutrinojs/react`](https://neutrinojs.org/packages/react/)                       |
| Preact           | Application  | [`@neutrinojs/preact`](https://neutrinojs.org/packages/preact/)                     |
| Vue              | Application  | [`@neutrinojs/vue`](https://neutrinojs.org/packages/vue/)                           |
| Web              | Application  | [`@neutrinojs/web`](https://neutrinojs.org/packages/web/)                           |
| Node.js          | Application  | [`@neutrinojs/node`](https://neutrinojs.org/packages/node/)                         |
| Library          | Library      | [`@neutrinojs/library`](https://neutrinojs.org/packages/library/)                   |
| React Components | Components   | [`@neutrinojs/react-components`](https://neutrinojs.org/packages/react-components/) |

## Test Runners

If you wish to use a test runner, `@neutrinojs/create-project` will offer to set
one up for you during the scaffolding phase.

| Test Runner | Middleware                                                    |
| ----------- | ------------------------------------------------------------- |
| Jest        | [`@neutrinojs/jest`](https://neutrinojs.org/packages/jest/)   |
| Karma       | [`@neutrinojs/karma`](https://neutrinojs.org/packages/karma/) |
| Mocha       | [`@neutrinojs/mocha`](https://neutrinojs.org/packages/mocha/) |

Be sure to check out the test runner preset to get more information on its
features and how files should be named.

## Linting

If you wish to add linting to your project, Neutrino makes it simple to set up
during the scaffolding process. `@neutrinojs/create-project` currently offers
two linting middleware choices.

| Linting style | Middleware                                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Airbnb        | With React/Preact: [`@neutrinojs/airbnb`](https://neutrinojs.org/packages/airbnb/) <br /> Other projects: [`@neutrinojs/airbnb-base`](https://neutrinojs.org/packages/airbnb-base/) |
| StandardJS    | [`@neutrinojs/standardjs`](https://neutrinojs.org/packages/standardjs/)                                                                                                             |

## Project Layout

`@neutrinojs/create-project` follows the standard
[project layout](https://neutrinojs.org/project-layout/) specified by Neutrino.
This means that by default all project source code should live in a directory
named `src` in the root of the project. This includes JavaScript files, CSS
stylesheets, images, and any other assets that would be available to import your
compiled project. Neutrino will scaffold the project with the initial
package.json, Neutrino set up, and project layout necessary to immediately start
your project.

When it comes to test runners, all project test code should live in a directory
named `test` in the root of the project. Be sure to check out the test runner
preset to get more information on its features and how files should be named.

## Customization

No two JavaScript projects are ever the same, and as such there may be times
when you will need to make modifications to the way your Neutrino presets are
building your project. Neutrino provides a mechanism to augment presets and
middleware in the context of a project without resorting to creating and
publishing an entirely independent preset. To override the build configuration,
start with the documentation on
[customization](https://neutrinojs.org/customization/).

## Contributing

This project is part of the [neutrino](https://github.com/neutrinojs/neutrino)
repository, a monorepo containing all resources for developing Neutrino and its
core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/create-project.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/create-project.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/create-project
