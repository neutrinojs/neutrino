# Scaffold a New Project

Neutrino can help you quickly start new projects by scaffolding your initial project structure.
`create-neutrino-project` uses middleware and presets behind the scene to build projects. If you are not
familiar with them, take a moment to explore [middleware](https://neutrino.js.org/middleware/)
and [presets](https://neutrino.js.org/presets/).

## Getting Started

Run the following command to start the process. Substitute `<directory-name>` with the directory name you wish to create for this project.

### Yarn

```
❯ yarn create neutrino-project <directory-name>
```

_Note: The `create` command is a shorthand that helps you do two things at once. See the [Yarn create docs](https://yarnpkg.com/lang/en/docs/cli/create/) for more details._

### npm/npx

```
❯ npx create-neutrino-project <directory-name>
```

## Available Projects

`create-neutrino-project` presently offers a scaffolding project to build an application, a library,
or components. Depending on the project type, the CLI helper may offer different flavors
of that project to scaffold. Each project type harnesses the power of middleware or presets to configure itself.

| Project | Project Type | Middleware |
|---|---|---|
| React | Application | [`neutrino-preset-react`](https://neutrino.js.org/presets/neutrino-preset-react/) |
| Web | Application | [`neutrino-preset-web`](https://neutrino.js.org/presets/neutrino-preset-web/) |
| Node.js | Application | [`neutrino-preset-node`](https://neutrino.js.org/presets/neutrino-preset-node/) |
| Web | Library | [`neutrino-preset-taskcluster-web-library`](https://www.npmjs.com/package/neutrino-preset-taskcluster-web-library) |
| React Components | Components | [`neutrino-preset-react-components`](https://www.npmjs.com/package/neutrino-preset-react-components) |

## Test Runners

If you wish to use a test runner, `create-neutrino-project` will offer to set one up for you during
the scaffolding phase.

| Test Runner | Middleware |
|---|---|
| Jest | [`neutrino-preset-jest`](https://neutrino.js.org/presets/neutrino-preset-jest/) |
| Karma | [`neutrino-preset-karma`](https://neutrino.js.org/presets/neutrino-preset-karma/) |
| Mocha | [`neutrino-preset-mocha`](https://neutrino.js.org/presets/neutrino-preset-mocha/) |

Be sure to check out the test runner preset to get more information on its features and how files should be named.

## Linting

If you wish to add linting to your project, Neutrino makes it simple to set up during the scaffolding
process. `create-neutrino-project` currently offers two linting middleware choices.

| Linting style | Middleware |
|---|---|
| Airbnb | With React: [`neutrino-preset-airbnb`](https://www.npmjs.com/package/neutrino-preset-airbnb) <br> Other projects: [`neutrino-preset-airbnb-base`](https://neutrino.js.org/presets/neutrino-preset-airbnb-base/) |
| StandardJS | [`neutrino-middleware-standardjs`](https://www.npmjs.com/package/neutrino-middleware-standardjs) |

## Project Layout

`create-neutrino-project` follows the standard [project layout](https://neutrino.js.org/project-layout.html) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to import your compiled project. Neutrino will scaffold the project with the initial package.json, Neutrino set up,
and project layout necessary to immediately start your project.

When it comes to test runners, all project test code should live in a directory named `test` in the
root of the project. Be sure to check out the test runner preset to get more information on its
features and how files should be named.

## Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications
to the way your Neutrino presets are building your project. Neutrino provides a mechanism to augment presets and
middleware in the context of a project without resorting to creating and publishing an entirely independent preset.
To override the build configuration, start with the documentation
on [customization](https://neutrino.js.org/customization/).

## Contributing

This project is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.
