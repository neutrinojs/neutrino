# Scaffold a New Project

Neutrino provides a scaffolding tool to help you quickly jump-start a project. `create-neutrino-project` uses
presets behind the scene to build projects. If you are not familiarized with them, take a moment to
explore [what presets are](https://neutrino.js.org/presets/).

## Getting Started
Run the following command to start the interactive session. Substitute `<directory-name>` with the directory name you wish to create for this project.

### Yarn

```
❯ yarn create neutrino-project <directory-name>
```

_Note: The `create` command is a shorthand that helps you do two things at once. See the [Yarn create docs](https://yarnpkg.com/lang/en/docs/cli/create/) for more details._

### npm

```
❯ npm install -g create-neutrino-project
❯ create-neutrino-project <directory-name>
```

## Available Projects
`create-neutrino-project` presently offers a scaffolding project to build an application, a library,
or components. Depending on the project type, the CLI helper may offer different flavors
of that project to scaffold. Each project type harnesses the power of a preset to configure itself.

| Project     | Project Type     | Preset                                                                                                             |
|-------------|------------------|--------------------------------------------------------------------------------------------------------------------|
| Application | React            | [`neutrino-preset-react`](https://neutrino.js.org/presets/neutrino-preset-react/)                                  |
| Application | Web              | [`neutrino-preset-web`](https://neutrino.js.org/presets/neutrino-preset-web/)                                      |
| Application | Node.js          | [`neutrino-preset-node`](https://neutrino.js.org/presets/neutrino-preset-node/)                                    |
| Library     | Web              | [`neutrino-preset-taskcluster-web-library`](https://www.npmjs.com/package/neutrino-preset-taskcluster-web-library) |
| Components  | React Components | [`neutrino-preset-react-components`](https://www.npmjs.com/package/neutrino-preset-react-components)               |

## Test Runners
Testing is necessary because we all make mistakes. `create-neutrino-project` offers the following test runners:

| Test Runner | Preset                                                                            |
|-------------|-----------------------------------------------------------------------------------|
| Jest        | [`neutrino-preset-jest`](https://neutrino.js.org/presets/neutrino-preset-jest/)   |
| Karma       | [`neutrino-preset-karma`](https://neutrino.js.org/presets/neutrino-preset-karma/) |
| Mocha       | [`neutrino-preset-mocha`](https://neutrino.js.org/presets/neutrino-preset-mocha/) |

Be sure to check out the test runner preset to get more information on its features and how files should be named.

## Linters
Linting is the easiest thing you can do to improve a project. The CLI helper offers two linter choices.

| Linter      | Preset                                                                                                                                                                                                                |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Airbnb      | React project: [`neutrino-preset-airbnb`](https://www.npmjs.com/package/neutrino-preset-airbnb) <br> Non React project: [`neutrino-preset-airbnb-base`](https://neutrino.js.org/presets/neutrino-preset-airbnb-base/) |
| StandardJS  | [`neutrino-middleware-standardjs`](https://www.npmjs.com/package/neutrino-middleware-standardjs)                                                                                                                      |

## Project Layout
`create-neutrino-project` follows the standard [project layout](https://neutrino.js.org/project-layout.html) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files, CSS stylesheets, images, and any other assets that would be available
to import your compiled project.

With it comes to test runners, all project test code should live in a directory named `test` in the
root of the project. Be sure to check out the test runner preset to get more information on its
features and how files should be named.


## Contributing

This project is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.
