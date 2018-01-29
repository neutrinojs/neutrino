# Neutrino Karmatic Preset

`@neutrinojs/karmatic` is a Neutrino preset that supports testing web applications using [Karmatic](https://github.com/developit/karmatic).

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Features

- Zero upfront configuration necessary to start testing on real browsers with Karma, Jasmine, Chrome Headless with Puppeteer.
- Babel compilation that compiles your tests using the same Babel options used by your source code
- Source watching for re-running of tests on change
- Out-of-the-box support for running in CI
- Easily extensible to customize your testing as needed

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8, Neutrino build preset

## Installation

`@neutrinojs/karmatic` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `@neutrinojs/karmatic` are development dependencies. You will also be using
another Neutrino preset for building your application source code.

#### Yarn

```bash
❯ yarn add --dev @neutrinojs/karmatic
```

#### npm

```bash
❯ npm install --save-dev @neutrinojs/karmatic
```

## Project Layout

`@neutrinojs/karmatic` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project test code should live in a directory named `test` in the root of the
project. Test files end in `_test.js` or `.test.js` by default.

## Quickstart

After adding the Karma preset to your Neutrino-built project, add a new directory named `test` in the root of the
project, with a single JS file named `simple_test.js` in it.

```bash
❯ mkdir test && touch test/simple_test.js
```

Edit your `test/simple_test.js` file with the following:

```js
describe('simple', () => {
  it('should be sane', () => {
    expect(true).not.toBe(false);
  });
});
```

Now edit your project's package.json to add commands for testing your application. In this example,
let's pretend this is a React project:

```json
{
  "scripts": {
    "test": "neutrino test --use @neutrinojs/react @neutrinojs/karmatic"
  }
}
```

Or if you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: [
    '@neutrinojs/react',
    '@neutrinojs/karmatic'
  ]
}
```

Run the tests, and view the results in your console:

#### Yarn

```bash
❯ yarn test

START:
21 11 2017 06:56:39.804:INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
21 11 2017 06:56:39.806:INFO [launcher]: Launching browser ChromeHeadless with unlimited concurrency
21 11 2017 06:56:39.809:INFO [launcher]: Starting browser ChromeHeadless
21 11 2017 06:56:40.170:INFO [HeadlessChrome 0.0.0 (Mac OS X 10.13.0)]: Connected on socket PW-kCVej8pQuT-HAAAAA with id 14691980
  simple
    ✔ should be sane

Finished in 0.005 secs / 0 secs @ 06:56:40 GMT-0600 (CST)

SUMMARY:
✔ 1 test completed
```

#### npm

```bash
❯ npm test

START:
21 11 2017 06:56:39.804:INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
21 11 2017 06:56:39.806:INFO [launcher]: Launching browser ChromeHeadless with unlimited concurrency
21 11 2017 06:56:39.809:INFO [launcher]: Starting browser ChromeHeadless
21 11 2017 06:56:40.170:INFO [HeadlessChrome 0.0.0 (Mac OS X 10.13.0)]: Connected on socket PW-kCVej8pQuT-HAAAAA with id 14691980
  simple
    ✔ should be sane

Finished in 0.005 secs / 0 secs @ 06:56:40 GMT-0600 (CST)

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

`@neutrinojs/karmatic` can watch for changes on your source directory and subsequently re-run tests. Simply use the
`--watch` flag with your `neutrino test` command.

## Preset options

You can provide custom options and have them merged with this preset's default options, which are subsequently passed
to Karmatic. You can modify Karmatic settings from `.neutrinorc.js` by overriding with any options Karmatic accepts.
In a standalone Karma project this is typically done in a `karma.conf.js` or similar file, but `@neutrinojs/karmatic` allows
configuration through `.neutrinorc.js` as well. This accepts the same configuration options as outlined in the
[Karma documentation](https://karma-runner.github.io/1.0/config/configuration-file.html) via Karmatic.
Use an array pair instead of a string to supply these options.

_Example: Change the duration Karma waits for a browser to reconnect (in ms)._

```js
module.exports = {
  use: [
    ['@neutrinojs/karmatic', { browserDisconnectTimeout: 5000 }]
  ]
};
```

## Using from CI

`@neutrinojs/karmatic` needs no additional configuration to run your tests in CI infrastructure when using Chrome Headless.
If you decide to use a browser with a display, you will need to ensure your CI can actually run the tests similar to
a headless mode. This usually means having a display emulator and access to the browsers you are testing against.

For an example using Travis-CI and normal Chrome, you will need to add the following to your `.travis.yml` file:

```yaml
before_install:
- export CHROME_BIN=chromium-browser
- export DISPLAY=:99.0
- sh -e /etc/init.d/xvfb start
```

You may also need to pass additional options to the Karmatic preset to change its behavior in CI, using standard
Chrome as an example instead of Chrome Headless:

```js
module.exports = {
  use: [
    ['@neutrinojs/karmatic', {
      browsers: [process.env.CI ? 'ChromeCI' : 'Chrome'],
      customLaunchers: {
        ChromeCI: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },
    }]
  ]
}
```

## Contributing

This preset is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/karmatic.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/karmatic.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/karmatic
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
