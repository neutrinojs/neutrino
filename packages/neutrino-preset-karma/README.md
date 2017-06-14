# Neutrino Karma Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-karma` is a Neutrino preset that supports testing web applications using the Karma test runner.

## Features

- Zero upfront configuration necessary to start testing on real browsers with Karma, Mocha, and Chrome
- Babel compilation that compiles your tests using the same Babel options used by your source code
- Source watching for re-running of tests on change
- Out-of-the-box support for running in CI
- Easily extensible to customize your testing as needed

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v6, Neutrino build preset

## Installation

`neutrino-preset-karma` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-karma` are development dependencies. You will also be using
another Neutrino preset for building your application source code.

#### Yarn

```bash
❯ yarn add --dev neutrino-preset-karma
```

#### npm

```bash
❯ npm install --save-dev neutrino-preset-karma
```

## Project Layout

`neutrino-preset-karma` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project test code should live in a directory named `test` in the root of the
project. Test files end in `_test.js` by default.

## Quickstart

After adding the Karma preset to your Neutrino-built project, add a new directory named `test` in the root of the
project, with a single JS file named `simple_test.js` in it.

```bash
❯ mkdir test && touch test/simple_test.js
```

Edit your `test/simple_test.js` file with the following:

```js
import assert from 'assert';

describe('simple', () => {
  it('should be sane', () => {
    assert.equal(true, !false);
  });
});
```

Now edit your project's package.json to add commands for testing your application. In this example,
let's pretend this is a React project:

```json
{
  "scripts": {
    "test": "neutrino test --use neutrino-preset-react neutrino-preset-karma"
  }
}
```

Or if you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: [
    'neutrino-preset-react',
    'neutrino-preset-karma'
  ]
}
```

Run the tests, and view the results in your console:

#### Yarn

```bash
❯ yarn test

START:
16 02 2017 10:36:34.713:INFO [karma]: Karma v1.7.0 server started at http://0.0.0.0:9876/
16 02 2017 10:36:34.715:INFO [launcher]: Launching browser Chrome with unlimited concurrency
16 02 2017 10:36:34.731:INFO [launcher]: Starting browser Chrome
16 02 2017 10:36:35.655:INFO [Chrome 56.0.2924 (Mac OS X 10.12.3)]: Connected on socket MkTbqJLpAAa2HFaeAAAA with id 21326158
  simple
    ✔ should be sane

Finished in 0.003 secs / 0 secs @ 10:36:35 GMT-0600 (CST)

SUMMARY:
✔ 1 test completed
✨  Done in 7.54s.
```

#### npm

```bash
❯ npm test

START:
16 02 2017 10:38:12.865:INFO [karma]: Karma v1.7.0 server started at http://0.0.0.0:9876/
16 02 2017 10:38:12.867:INFO [launcher]: Launching browser Chrome with unlimited concurrency
16 02 2017 10:38:12.879:INFO [launcher]: Starting browser Chrome
16 02 2017 10:38:13.688:INFO [Chrome 56.0.2924 (Mac OS X 10.12.3)]: Connected on socket svRGoxU0etKTKQWhAAAA with id 68456725
  simple
    ✔ should be sane

Finished in 0.006 secs / 0 secs @ 10:38:13 GMT-0600 (CST)

SUMMARY:
✔ 1 test completed
```

To run tests against files from your source code, simply import them:

```js
import thingToTest from '../src/thing';
```

For more details on specific Karma usage, please refer to their
[documentation](https://karma-runner.github.io/1.0/index.html).

## Executing single tests

By default this preset will execute every test file located in your test directory ending in the appropriate file
extension. Use the command line [`files` parameters](https://neutrino.js.org/cli#neutrino-test) to execute individual tests.

## Watching for changes

`neutrino-preset-karma` can watch for changes on your source directory and subsequently re-run tests. Simply use the
`--watch` flag with your `neutrino test` command.

## Using from CI

`neutrino-preset-karma` needs no additional configuration to run your tests in CI infrastructure, but you will still
need to ensure your CI can actually run the tests. This usually means having a display emulator and access to the
browsers you are testing against.

To do this in Travis-CI, you will need to add the following to your `.travis.yml` file for Chrome tests:

```yaml
before_install:
  - export CHROME_BIN=chromium-browser
  - export DISPLAY=:99.0
  - sh -e /etc/init.d/xvfb start
```

## Preset options

You can provide custom options and have them merged with this preset's default options, which are subsequently passed
to Karma. You can modify Karma settings from `.neutrinorc.js` by overriding with any options Karma accepts. In a standalone
Karma project this is typically done in a `karma.conf.js` or similar file, but `neutrino-preset-karma` allows
configuration through `.neutrinorc.js` as well. This accepts the same configuration options as outlined in the
[Karma documentation](https://karma-runner.github.io/1.0/config/configuration-file.html). Use an array pair instead of
a string to supply these options.

_Example: Change the duration Karma waits for a browser to reconnect (in ms)._

```js
module.exports = {
  use: [
    ['neutrino-preset-karma', { browserDisconnectTimeout: 5000 }]
  ]
};
```

If you wish to completely override the Karma configuration instead of it being merged, set the `override` property to
`true` in the preset options:

```js
module.exports = {
  use: [
    ['neutrino-preset-karma', {
      override: true,
      /* specify all other Karma configuration options */
    }]
  ]
};
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-karma.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-karma.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-karma
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
