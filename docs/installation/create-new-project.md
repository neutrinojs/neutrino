# Create new project

Neutrino can help you quickly start new projects by scaffolding your initial project structure. `@neutrinojs/create-project` uses middleware and presets behind the scene to build projects. If you are not familiar with them, take a moment to explore [middleware](https://github.com/mozilla-neutrino/neutrino-dev/tree/afaf7b436484b3337e9017d70525ebcfee0b4738/middleware/README.md) and [presets](https://github.com/mozilla-neutrino/neutrino-dev/tree/afaf7b436484b3337e9017d70525ebcfee0b4738/presets/README.md).

![](https://img.shields.io/npm/v/@neutrinojs/create-project.svg) ![](https://img.shields.io/npm/dt/@neutrinojs/create-project.svg)

## Getting Started

Run the following command to start the process. Substitute `<directory-name>` with the directory name you wish to create for this project.

### Yarn

```text
❯ yarn create @neutrinojs/project <directory-name>
```

_Note: The _`create`_ command is a shorthand that helps you do two things at once. See the _[_Yarn create docs_](https://yarnpkg.com/lang/en/docs/cli/create)_ for more details._

### npm/npx

```text
❯ npx @neutrinojs/create-project <directory-name>
```

## Available Projects

`@neutrinojs/create-project` presently offers a scaffolding project to build an application, a library, or components. Depending on the project type, the CLI helper may offer different flavors of that project to scaffold. Each project type harnesses the power of middleware or presets to configure itself.

| Project | Project Type | Middleware |
| --- | --- | --- |
| React | Application | [`@neutrinojs/react`](../packages/react.md) |
| Preact | Application | [`@neutrinojs/preact`](../packages/preact.md) |
| Vue | Application | [`@neutrinojs/vue`](../packages/vue.md) |
| Web | Application | [`@neutrinojs/web`](../packages/web.md) |
| Node.js | Application | [`@neutrinojs/node`](../packages/node.js.md) |
| Web | Library | [`@neutrinojs/library`](../packages/library.md) |
| React Components | Components | [`@neutrinojs/react-components`](../packages/react-components.md) |

## Test Runners

If you wish to use a test runner, `@neutrinojs/create-project` will offer to set one up for you during the scaffolding phase.

| Test Runner | Middleware |
| --- | --- |
| Jest | [`@neutrinojs/jest`](../packages/jest.md) |
| Karma | [`@neutrinojs/karma`](https://github.com/mozilla-neutrino/neutrino-dev/tree/afaf7b436484b3337e9017d70525ebcfee0b4738/docs/pakages/karma/README.md) |
| Mocha | [`@neutrinojs/mocha`](../packages/mocha.md) |

Be sure to check out the test runner preset to get more information on its features and how files should be named.

## Linting

If you wish to add linting to your project, Neutrino makes it simple to set up during the scaffolding process. `@neutrinojs/create-project` currently offers two linting middleware choices.

| Linting style | Middleware |
| --- | --- |
| Airbnb | With React/Preact: [`@neutrinojs/airbnb`](https://github.com/mozilla-neutrino/neutrino-dev/tree/afaf7b436484b3337e9017d70525ebcfee0b4738/docs/airbnb/README.md)   Other projects: [`@neutrinojs/airbnb-base`](../packages/airbnb-base.md) |
| StandardJS | [`@neutrinojs/standardjs`](../packages/standardjs.md) |

## Project Layout

`@neutrinojs/create-project` follows the standard [project layout](https://github.com/mozilla-neutrino/neutrino-dev/tree/afaf7b436484b3337e9017d70525ebcfee0b4738/project-layout/README.md) specified by Neutrino. This means that by default all project source code should live in a directory named `src` in the root of the project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available to import your compiled project. Neutrino will scaffold the project with the initial package.json, Neutrino set up, and project layout necessary to immediately start your project.

When it comes to test runners, all project test code should live in a directory named `test` in the root of the project. Be sure to check out the test runner preset to get more information on its features and how files should be named.

## Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications to the way your Neutrino presets are building your project. Neutrino provides a mechanism to augment presets and middleware in the context of a project without resorting to creating and publishing an entirely independent preset. To override the build configuration, start with the documentation on [customization](https://github.com/mozilla-neutrino/neutrino-dev/tree/afaf7b436484b3337e9017d70525ebcfee0b4738/customization/README.md).

## Contributing

This project is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo containing all resources for developing Neutrino and its core presets and middleware. Follow the [contributing guide](https://github.com/mozilla-neutrino/neutrino-dev/tree/afaf7b436484b3337e9017d70525ebcfee0b4738/contributing/README.md) for details.

