# Upgrading from Neutrino v5 to v6

Neutrino v6 introduces a number of changes, with some of them being breaking changes. To upgrade from Neutrino v5
to v6, be sure to check this list for tasks you may need to perform to use this latest version:

- **BREAKING CHANGE** Neutrino overrides and configuration is no longer done from package.json, but can automatically
be picked up in a `.neutrinorc.js` file. If you want to leave your configuration in package.json until
you migrate completely to the RC file, put the following contents in your `.neutrinorc.js` file:

```js
const pkg = require('./package.json');

module.exports = {
  options: pkg.neutrino.options || {},
  use: [
    ...(pkg.neutrino.use || []),
    neutrino => neutrino.config.merge(pkg.neutrino.config || {})
  ]
};
```

See the documentation on `.neutrinorc.js` for more details on overriding configuration.

- **BREAKING CHANGE** The Web and React presets no longer include a polyfill for `Buffer`. This saves approximately 60KB
of polyfills from being loaded, at the expense of using the `Buffer` constructor. If you need the `Buffer`
constructor or a dependency relies on it, you can override the configuration in `.neutrinorc.js`:

```js
neutrino.config.node.set('Buffer', true)
```

- **BREAKING CHANGE** Neutrino no longer relies on `HOST`, `PORT`, and `HTTPS` environment variables for overriding
the webpack-dev-server settings, respectively. You can choose to either override these from `.neutrinorc.js` or
a one-off basis using CLI options:

```js
// Override a preset/middleware:
module.exports = {
  use: [
    ['neutrino-preset-react', {
      devServer: {
        host: '192.168.1.10',
        port: 3000,
        https: true
      }
    }]
  ]
};
```

```js
// Override all presets:
module.exports = {
  options: {
    host: '192.168.1.10',
    port: 3000,
    https: true
  }
};
```

```bash
# Override from CLI
neutrino start --options.host 192.168.1.10 --options.port 3000 --options.https
```

- **BREAKING CHANGE** Setting `host` of `0.0.0.0` for webpack-dev-server is insecure and will not work properly. This
is from https://github.com/webpack/webpack-dev-server/issues/887 causing a potential security issue into Webpack
users' machines. When using `host`, specify your actual local IP address, and Neutrino will bind it to the `public`
property of webpack-dev-server and set the host to `0.0.0.0` for you. Attempting to access the site from a host other
than specified will result in an invalid host header error.

Should you absolutely need to access the site from any potential host, for example if behind a proxy or firewall,
override from `.neutrinorc.js`:

```js
// Override a preset/middleware
module.exports = {
  use: [
    ['neutrino-preset-react', {
      devServer: {
        disableHostCheck: true
      }
    }]
  ]
};

// Override configuration
neutrino.config.devServer.disableHostCheck(true)
```

- **BREAKING CHANGE** The chunk middleware no longer includes a plugin named `"chunk"`, and instead exposes several
plugins which handle different chunking mechanisms: `named-modules`, `named-chunks`, `vendor-chunk`, `runtime-chunk`,
and `name-all`.

- **BREAKING CHANGE** With the changes in chunk middleware, there is no longer a named-modules middleware for v6 since
this now comes with the chunk middleware.

- **BREAKING CHANGE** All non-JS assets within your source directory are not automatically copied to the output
directory. A new Neutrino option for `static` now specifies a directory for all non-compiled/included assets, and this
defaults to `src/static`. For example, if you wanted to include some images into the build that are not `import`ed into
your project, you can place them in `src/static` and they will be automatically copied to `build/static`.

- **BREAKING CHANGE** The `run` function from Neutrino's exports has been removed in favor of a `run` method on the API.

- **BREAKING CHANGE** The `build`, `start`, `test`, and `inspect` functions from Neutrino's exports no longer
instantiate the Neutrino API, but are now functions that are passed to the Neutrino API's `run` method. For example, to
run the `build` function, you can pass it via:

```js
const { Neutrino, build } = require('neutrino');

Neutrino()
  .run('build', [middleware], build)
  .fork(errorHandler, successHandler);
```

See the [Neutrino API](./api) for details on the updated API.

- **BREAKING CHANGE** Since the Neutrino API has changed, creating a `.eslintrc.js` file has also changed. If you have
your middleware defined in `.neutrinorc.js`, your `.eslintrc.js` file can be as simple as:

```js
module.exports = require('neutrino/src/api')().call('eslintrc');
```

For a more verbose example version without `.neutrinorc.js`:

```js
const { Neutrino } = require('neutrino');
const api = Neutrino();

module.exports = api.call('eslintrc', ['neutrino-preset-airbnb-base', 'neutrino-preset-react']);
```

**BREAKING CHANGE** An empty object is no longer passed as options to middleware if no options have been specified.

**Dependency potential BREAKING CHANGES:**

  - `babel-core` upgraded to v7.0.0
  - `file-loader` upgraded to v0.11.2
  - `file-loader` removed from `html-loader` middleware, switched to `html-loader`
  - `babili-webpack-plugin` upgraded to v0.1.1
  - `css-loader` upgraded to v0.28.4
  - `style-loader` upgraded to v0.18.2
  - `jest` upgraded to v20.0.3
  - `react-hot-loader` upgraded to v3.0.0-beta.7
  

- Async polyfills are now using fast-async instead of Babel's regenerator. The reasoning is explained in the
[fast-async README](https://github.com/MatAtBread/fast-async):

> 'fast-async' is a Babel v6.x.x plugin that implements the ES7 keywords async and await using syntax transformation
at compile-time, rather than generators. The main reason for using 'fast-async' as opposed to Babel's default
implementation of async/await is performance (https://github.com/MatAtBread/nodent#performance) - it's 3-4 times faster
in a browser/node, and as much as 10 times faster on a mobile browsers, mainly due to avoiding generators
(and therefore regenerator).

If you wish to disable the fast-async polyfill, you can specify it to the Web, React, and Node.js presets from
your `.neutrinorc.js`:

```js
module.exports = {
  use: [
    ['neutrino-preset-web', {
      polyfills: { async: false }
    }]
  ]
};
```

- The React preset is now additionally Babel-compiled with `transform-class-properties`, and during `development` also
includes `transform-es2015-classes` to work around https://github.com/gaearon/react-hot-loader/issues/313.

- The Node.js preset, start-server middleware, and babel-preset-env in any middleware can be debugged with the `--debug`
CLI flag or the Neutrino option `debug`.

- The Node.js preset now compiles Babel to support Node.js LTS which has moved to v6.10 from v6.9.

- Babel compiles using a `cacheDirectory` to improve subsequent build times.

- The Neutrino API now exposes generic `prerun` and `run` events which are triggered prior to at any command
running, e.g. running `neutrino build` will trigger a `prebuild`, `prerun`, `build`, and `run` events.

- The ESLint middleware now defaults to a `development` NODE_ENV if none is specified.

- Configuration can now more easily be overridden based on the values of environment variables from `.neutrinorc.js`
using the `env` property. Each property within `env` maps to an environment variable with key-values mapping to 
environment values which contain further middleware. This works for any environment variable, not just `NODE_ENV`.
For example, if you wanted to include additional middleware when `NODE_ENV` is `production`:

```js
module.exports = {
  env: {
    NODE_ENV: {
      production: {
        use: ['neutrino-middleware-pwa']
      }
    }
  }
};
```
