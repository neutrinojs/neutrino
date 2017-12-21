# Neutrino Loader Merge Middleware

`@neutrinojs/loader-merge` is Neutrino middleware for easily performing a deep merge of options into
a named rule and named loader in a Neutrino configuration.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@neutrinojs/loader-merge` can be installed via the Yarn or npm clients.

#### Yarn

```bash
❯ yarn add @neutrinojs/loader-merge
```

#### npm

```bash
❯ npm install --save @neutrinojs/loader-merge
```

## Usage

`@neutrinojs/loader-merge` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const loaderMerge = require('@neutrinojs/loader-merge');

neutrino.use(loaderMerge('compile', 'babel'), {
  plugins: ['object-rest-spread']
});

// Equivalent to:
neutrino.config.module
  .rule('compile')
  .use('babel')
    .tap(options => require('deepmerge')(options, {
      plugins: ['object-rest-spread']
    }));
```

This middleware is a factory intended to be invoked with a rule name and a loader name for which to extend the options.
Upon invoking, it will return a middleware function to be provided to Neutrino's `use()` method. This middleware is
only useful to the function middleware format.

```js
const middleware = loaderMerge(ruleName, loaderName);

neutrino.use(middleware, options);
```


## Customization

`@neutrinojs/loader-merge` does not create any of its own conventions; it is only middleware
for extending the options for a rule loader which has created its own conventions.

## Contributing

This middleware is part of the [neutrino-dev](https://github.com/mozilla-neutrino/neutrino-dev) repository, a monorepo
containing all resources for developing Neutrino and its core presets and middleware. Follow the
[contributing guide](https://neutrino.js.org/contributing) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/loader-merge.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/loader-merge.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/loader-merge
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
