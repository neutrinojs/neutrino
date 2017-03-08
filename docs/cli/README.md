# Neutrino CLI

Using the command-line interface is the preferred and simplest way of interacting with Neutrino.

When using the Neutrino CLI, you provide a list of presets for the API to attempt to load and merge configurations for.
Each preset will attempt to be loaded from the current working directory's `node_modules`, nested within, by name, or
relative file path. If it cannot be found, an exception will be thrown.

In addition to any provided presets, Neutrino will also attempt to load configuration data from the package.json
residing in the current working directory. If this package.json contains an object at `neutrino.config`, this data
will be merged with the Neutrino configuration after all presets and middleware have been loaded.

Let's take a look at the CLI usage.

## `--help`

Using `neutrino --help` will bring up the following help guide:

```bash
❯ neutrino --help
Commands:
  start           Build a project in development mode
  build           Compile the source directory to a bundled build
  test [files..]  Run all suites from the test directory or provided files

Options:
  --inspect  Output a string representation of the configuration used by Neutrino and exit   [boolean]
  --presets  A list of Neutrino presets used to configure the build                          [array] [default: []]
  --version  Show version number                                                             [boolean]
  --help     Show help                                                                       [boolean]
```

## `--version`

Using `--version` will output the current version of the Neutrino CLI to the console and exit.

```bash
❯ neutrino --version
4.0.0
```

## `--presets`

The `--presets` flag can be used in conjunction with any of the top-level commands to specify a collection of
presets to load. These can be an npm package or a relative path to a module to load as a preset.

```bash
❯ neutrino start --presets neutrino-preset-react neutrino-preset-karma
```

The Neutrino CLI will still attempt to load any presets defined in the project's package.json located at
`config.presets`. Presets passed via the CLI `--presets` will take precedence over presets defined in
`config.presets`, meaning that options set by package.json presets can have their values overridden by
`--presets` presets.

## `--inspect`

The `--inspect` flag can be used to write out a stringified version of the Webpack configuration which has been
accumulated by all middleware. When using the `--inspect` flag, the Neutrino CLI will still import all presets and
middleware that has been supplied, but will then exit after logging the configuration to stdout. No builds, servers, or
watchers will be started.

```bash
❯ neutrino start --inspect --presets neutrino-preset-react neutrino-preset-jest
```

This could also be used to help create diffs between configuration changes. Take the following command:

```bash
❯ neutrino start --inspect --presets neutrino-preset-react neutrino-preset-jest
```

We can capture this inspection to a file, and capture the change by adding a preset override:

```bash
❯ neutrino start --inspect --presets neutrino-preset-react neutrino-preset-jest > a.config
❯ neutrino start --inspect --presets neutrino-preset-react neutrino-preset-jest override.js > b.config
```

Using `git diff a.config b.config`, we get a pretty diff of the configuration change:

```diff
diff --git a/a.config b/b.config
index 3356802..d4d82ef 100644
--- a/a.config
+++ b/b.config
@@ -3,6 +3,7 @@
   devtool: 'source-map',
   entry: {
     index: [
+      'babel-polyfill',
       '/node/src/index.js'
     ]
   },
```

## `neutrino start`

Using the command `neutrino start` builds a project in development mode, also starting a development server or source
watcher depending on the preset or config options used. This command sets the `NODE_ENV` environment variable to
`development`.

## `neutrino build`

Using the command `neutrino build` builds a project in production mode, rendering static assets to the configured build
output destination. This command sets the `NODE_ENV` environment variable to `production`.

## `neutrino test`

Using the command `neutrino test` passes execution onto a test runner preset. It is up to the preset being used to
determine how source files are built or provided to tests. See your particular test preset for details. This
command sets the `NODE_ENV` environment variable to `test`.

Looking at the `--help` for `neutrino test`:

```bash
❯ neutrino test --help
neutrino test [files..]

Options:
  --presets  A list of Neutrino presets used to configure the build    [array] [default: []]
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --coverage Collect test coverage information and generate report     [boolean] [default: false]
  --watch    Watch source files for changes and re-run tests           [boolean] [default: false]
```

Using the command `neutrino test` will execute every test file located in your
[testing directory](../project-layout#Testing). You may also provide to this command the specific test files you wish
to run individually. It is important to note that when combined with the `--presets` parameter, you should use two
dashes after the last preset to denote the end of the presets and the beginning of the test files.

```bash
❯ neutrino test a_test.js b_test.js
```

```bash
❯ neutrino test --presets neutrino-preset-react neutrino-preset-karma -- a_test.js b_test.js
```

You can also pass a flag `--watch` to watch source files for changes and re-run tests, if your preset supports it.

```bash
❯ neutrino test --watch
```

As well you can pass a flag `--coverage` to collect test coverage information and generate a report, if your preset
supports it.

```bash
❯ neutrino test --coverage
```

## Exit codes

When the CLI creates an instance of Neutrino, it waits for all commands to either resolve or reject their Promise.
If the command succeeded, the CLI will exit with code `0`. If there was an error, the CLI will log the error
to the console and exit with code `1`. This makes it easier to use Neutrino commands for status reasons, such
as failing a pull request on continuous integration if any tests fail or if there are linter errors.
