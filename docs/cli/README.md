# Neutrino CLI

Using the command-line interface is the preferred way of interacting with Neutrino. Let's take a look at its usage.

## `--help`

Using `neutrino --help` will bring up the following help guide:

```bash
❯ neutrino --help
Commands:
  start           Build a project in development mode
  build           Compile the source directory to a bundled build
  test [files..]  Run all suites from the test directory or provided files

Options:
  --presets  A list of Neutrino presets used to configure the build    [array] [default: []]
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
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

## neutrino start

Using the command `neutrino start` builds a project in development mode, also starting a development server or source
watcher depending on the preset or config options used. This command sets the `NODE_ENV` environment variable to
`development`.

## neutrino build

Using the command `neutrino build` builds a project in production mode, rendering static assets to the configured build
output destination. This command sets the `NODE_ENV` environment variable to `production`.

## neutrino test

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
[testing directory](/project-layout#Testing). You may also provide to this command the specific test files you wish
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
