# webpack-chain

Use a chaining API to generate and simplify the modification of
Webpack 2 configurations.

## Introduction

Webpack's core configuration is based on creating and modifying a
potentially unwieldy JavaScript object. While this is OK for configurations
on individual projects, trying to share these objects across projects and
make subsequent modifications gets messy, as you need to have a deep
understanding of the underlying object structure to make those changes.

`webpack-chain` attempts to improve this process by providing a chainable or
fluent API for creating and modifying webpack configurations. Key portions
of the API can be referenced by user-specified names, which helps to
standardize how to modify a configuration across projects.

This is easier explained through the examples following.

## Contributing

I welcome any contributor. Just fork and clone, make changes,
and send a pull request. Some beginner ideas:

- Right now there aren't very many shorthand methods for several options.
- A higher-level API for `Config.Resolve` and `Config.ResolveLoader` is lacking.
- Some API documentation is missing for working with module loaders at a low level.
- General docs improvements.

## Installation

`webpack-chain` requires Node.js v6.9 and higher. `webpack-chain` also
only creates configuration objects designed for use in Webpack 2.

You may install this package using either Yarn or npm (choose one):

**Yarn**

```bash
yarn add --dev webpack-chain
```

**npm**

```bash
npm install --save-dev webpack-chain
```

## Getting Started

Once you have `webpack-chain` installed, you can start creating a
Webpack configuration. For this guide, our example base configuration will
be `webpack.config.js` in the root of our project directory.

```js
// Require the webpack-chain module. This module exports a single
// constructor function for creating a configuration API.
const Config = require('webpack-chain');

// Instantiate the configuration with a new API
const config = new Config();

// Make configuration changes using the chain API.
// Every API call tracks a change to the stored configuration.

// Interact with entry points
config
  .entry('index')
    .add('src/index.js')
    .end()
  // Modify output settings
  .output
    .path('dist')
    .filename('[name].bundle.js');

// Create named rules which can be modified later
config.module
  .rule('lint')
    .test(/\.js$/)
    .pre()
    .include('src')
    // Even create named loaders for later modification
    .loader('eslint', 'eslint-loader', {
      rules: {
        semi: 'off'
      }
    });

config.module
  .rule('compile')
    .test(/\.js$/)
    .include('src', 'test')
    .loader('babel', 'babel-loader', {
      presets: [
        [require.resolve('babel-preset-es2015'), { modules: false }]
      ]
    });

// Create named plugins, too!

config
  .plugin('clean')
  .use(CleanPlugin, [BUILD], { root: CWD });

// Export the completed configuration object to be consumed by webpack
module.exports = config.getConfig();
```

Having shared configurations is also simple. Just export the configuration
and call `.getConfig()` prior to passing to Webpack.

```js
// webpack.core.js
const Config = require('webpack-chain');
const config = new Config();

// Make configuration shared across targets
// ...

module.exports = config;

// webpack.dev.js
const config = require('./webpack.core');

// Dev-specific configuration
// ...
module.exports = config.getConfig();

// webpack.prod.js
const config = require('./webpack.core');

// Production-specific configuration
// ...
module.exports = config.getConfig();
```

## API

### Config

Create a new configuration object.

```js
const Config = require('webpack-chain');

const config = new Config();
```

Moving to deeper points in the API will change the context of what you
are modifying. You can move back to the higher context by either referencing
the top-level `config` again, or by calling `.end()` to move up one level.
If you are familiar with jQuery, `.end()` works similarly. All API calls
will return the API instance at the current context unless otherwise
specified. This is so you may chain API calls continuously if desired.

### Config.Options

A `Config` instance provides two mechanisms for setting values on the
root configuration object: shorthand methods, and lower-level `set`
methods. Calling either of these is backed at `config.options`.
These configuration options are backed by JavaScript Maps, so calling `set`
will create unique mappings and overwrite existing values set at that
property name.

Let's start with the simpler shorthand methods:

---

```js
// baseDirectory: String
config.context(baseDirectory)
```

The base directory, an absolute path, for resolving entry points and
loaders from configuration.
<sup>[context docs](https://webpack.js.org/configuration/entry-context/#context)</sup>

Example:

```js
config.context(path.resolve(__dirname, 'src'));
```

---

```js
// devtool: String | false
config.target(devtool)
```

This option controls if and how Source Maps are generated.
<sup>[devtool docs](https://webpack.js.org/configuration/devtool/)</sup>

Example:

```js
config.devtool('source-map');
```

---

```js
// target: String
config.target(target)
```

Tells webpack which environment the application is targeting.
<sup>[target docs](https://webpack.js.org/configuration/target/)</sup>

Example:

```js
config.target('web');

config.target('node');
```

---

```js
// externals: String | RegExp | Function | Array | Object
config.externals(externals)
```

Externals configuration in Webpack provides a way of not including a
dependency in the bundle. Instead the created bundle relies on that
dependency to be present in the consumers environment. This typically
applies to library developers though application developers can make
good use of this feature too.
<sup>[target docs](https://webpack.js.org/configuration/externals/)</sup>

Example:

```js
config.externals({
  jquery: 'jQuery'
});
```

---

```js
// externals: String | RegExp | Function | Array | Object
config.externals(externals)
```

Externals configuration in Webpack provides a way of not including a
dependency in the bundle. Instead the created bundle relies on that
dependency to be present in the consumers environment. This typically
applies to library developers though application developers can make
good use of this feature too.
<sup>[target docs](https://webpack.js.org/configuration/externals/)</sup>

Example:

```js
config.externals({
  jquery: 'jQuery'
});
```

---

For options where a shorthand method does not exist, you can also set
root configuration settings by making calls to `.options.set`. These
configuration options are backed by JavaScript Maps, so calling `set`
will create unique mappings and overwrite existing values set at that
property name.

```js
config.options
  .set('devtool', 'eval')
  .set('externals', { jquery: 'jQuery' })
  .set('performance', {
    hints: 'warning'
  })
  .set('stats', {});
```

### Config.Module

This API is the primary interface for determining how the different types of
modules within a project will be treated.

#### Config.Module.Rules

`Config.Module.Rules` are matched to requests when modules are created. These
rules can modify how the module is created. They can apply loaders to the module,
or modify the parser. In `webpack-chain`, every rule is named for ease of modification
in shared configuration environments.

As an example, let's create a linting rule which let's us use ESLint against our project:

```js
config.module
  // Let's interact with a rule named "lint", this is user defined
  .rule('lint')
    // This rule works against files ending in .js
    .test(/\.js$/)
    // Designate this rule to pre-run before other normally defined rules
    .pre()
    // Only run this rule against files in src/
    .include('src')
    // Work against a loader we name "eslint".
    // This loader will use "eslint-loader".
    // Pass an object as the options to use for "eslint-loader"
    .loader('eslint', 'eslint-loader', {
      rules: {
        semi: 'off'
      }
    });
```

**You can add multiple loaders for a given rule.**

If you wish to overwrite the loader instance information for a named loader,
you may just call `.loader()` with the new arguments.

If you wish to modify an already created loader, **pass a function** to the loader API,
and return the new loader configuration.

```js
config.module
  .rule('lint')
  .loader('eslint', ({ loader, options }) => {
    options.rules.semi = 'error';
    return { loader, options };
  });

// Any object keys you leave off the return object will continue to use existing information:
config.module
  .rule('lint')
  // Leaves whatever loader used intact
  .loader('eslint', ({ options }) => {
    options.rules.semi = 'error';
    return { options };
  });
```

### Config.Plugins

Webpack plugins can customize the build in a variety of ways. See the
[Webpack docs](https://webpack.js.org/configuration/plugins/) for more detailed information.

In `webpack-chain`, all plugins are named to make modification easier in shared
configuration environments.

As an example, let's add a plugin to inject the `NODE_ENV` environment variable into our
web project:

```js
config
  // We have given this plugin the user-defined name of "env"
  .plugin('env')
  // .use takes a plugin to create, and a variable number of arguments which
  // will be passed to the plugin upon instantiation
  .use(webpack.EnvironmentPlugin, ['NODE_ENV']);
```

_NOTE: Do not use `new` to create the plugin, as this will be done for you._

If you want to modify how a defined plugin will be created, you can call `.inject`
to instantiate and modify the options provided to the plugin.

```js
// Above the "env" plugin was created. Somewhere else,
// let's also pull in another environment variable
config
  .plugin('env')
  .inject((Plugin, args) => new Plugin([...args, 'SECRET_KEY']));
```

### Config.Entries

Creating and modifying configuration entries is done through the
`config.entry()` API. This is backed in the configuration at `config.entries`.

```js
// entryNameIdentifier: String
config.entry(entryNameIdentifier)
```

A point to enter the application. Note that calling `config.entry()` only
specifies the name of the entry point to modify. Further API calls on this
entry will make actual changes to it. Entries are backed by JavaScript Sets,
so calling `add` will only add unique values, i.e. calling `add` many times
with the same value will only create a single entry point for that value.
<sup>[entry docs](https://webpack.js.org/configuration/entry-context/#entry)</sup>

Example:

```js
config.entry('index');
```

---

```js
// entryPath: String
entry.add(entryPath)
```

Add an entry point to a named entry.

Examples:

```js
config.entry('index').add('index.js');

config.entry('index')
  .add('babel-polyfill')
  .add('src/index.js')
  .add('webpack/hot/dev-server');
```

---

```js
entry.clear()
```

Removes all specified entry points from a named entry.

Example:

```js
// Previously added entry points
config.entry('index')
  .add('babel-polyfill')
  .add('src/index.js')
  .add('webpack/hot/dev-server');

// Remove all entry points from the `index` entry
config.entry('index').clear();
```

---

```js
// entryPath: String
entry.delete(entryPath)
```

Removes a single entry point from a named entry.

Example:

```js
// Previously added entry points
config.entry('index')
  .add('babel-polyfill')
  .add('src/index.js')
  .add('webpack/hot/dev-server');

// Remove all entry points from the `index` entry
config.entry('index').delete('babel-polyfill');
```

---

```js
// entryPath: String
// returns: Boolean
entry.has(entryPath)
```

Returns `true` or `false` depending on whether the named entry has the
specified entry point.

Examples:

```js
// Previously added entry points
config.entry('index')
  .add('babel-polyfill')
  .add('src/index.js')
  .add('webpack/hot/dev-server');

config.entry('index').has('babel-polyfill'); // true
config.entry('index').has('src/fake.js'); // false
```

---

```js
// returns: Array
entry.values()
```

Returns an array of all the entry points for a named entry.

Examples:

```js
// Previously added entry points
config.entry('index')
  .add('babel-polyfill')
  .add('src/index.js')
  .add('webpack/hot/dev-server');

config.entry('index')
  .values(); // ['babel-polyfill', 'src/index.js', 'webpack/hot/dev-server']

config.entry('index')
  .values()
  .map(entryPoint => console.log(entryPoint));
// babel-polyfill
// src/index.js
// webpack/hot/dev-server
```

### Config.Output

A `Config.Output` instance provides two mechanisms for setting values on the
configuration output: shorthand methods, and lower-level `set`
methods. Calling either of these is backed at `config.output.options`.


```js
// path: String
output.path(path)
```

The output directory as an absolute path.
<sup>[output path docs](https://webpack.js.org/configuration/output/#output-path)</sup>

Example:

```js
config.output
  .path(path.resolve(__dirname, 'dist'));
```

---

```js
// bundleName: String
output.filename(bundleName)
```

This option determines the name of each output bundle. The bundle is written
to the directory specified by the output.path option.
<sup>[output filename docs](https://webpack.js.org/configuration/output/#output-filename)</sup>

Examples:

```js
config.output.filename('bundle.js');

config.output.filename('[name].bundle.js');
```

---

```js
// chunkFilename: String
output.chunkFilename(chunkFilename)
```

This option determines the name of on-demand loaded chunk files.
See output.filename option for details on the possible values.
<sup>[output chunkFilename docs](https://webpack.js.org/configuration/output/#output-chunkfilename)</sup>

Example:

```js
config.output.chunkFilename('[id].[chunkhash].js');
```

---

```js
// publicPath: String
output.publicPath(publicPath)
```

This option specifies the public URL of the output directory when referenced in a browser.
<sup>[output publicPath docs](https://webpack.js.org/configuration/output/#output-publicpath)</sup>

Examples:

```js
config.output.publicPath('https://cdn.example.com/assets/');

config.output.publicPath('/assets/');
```

---

```js
// libraryName: String
output.library(libraryName)
```

Use `library`, and `libraryTarget` below, when writing a JavaScript library
that should export values, which can be used by other code depending on it.
<sup>[output library docs](https://webpack.js.org/configuration/output/#output-library)</sup>

Examples:

```js
config.output.library('MyLibrary');
```

---

```js
// target: String
output.libraryTarget(target)
```

Configure how a library will be exposed.
Use `libraryTarget`, and `library` above, when writing a JavaScript library
that should export values, which can be used by other code depending on it.
<sup>[output libraryTarget docs](https://webpack.js.org/configuration/output/#output-librarytarget)</sup>

Examples:

```js
config.output.libraryTarget('var');

config.output.libraryTarget('amd');

config.output.libraryTarget('umd');
```

---

For output where a shorthand method does not exist, you can also set
output options by making calls to `.output.set`. These
configuration options are backed by JavaScript Maps, so calling `set`
will create unique mappings and overwrite existing values set at that
property name.

Examples:

```js
config.output
  .set('crossOriginLoading', 'anonymous')
  .set('sourcePrefix', '\t')
  .set('umdNamedDefine', true);
```

### Config.DevServer

This set of options is picked up by webpack-dev-server and can be used to change
its behavior in various ways. [Webpack docs](https://webpack.js.org/configuration/dev-server/).

A `Config.DevServer` instance provides two mechanisms for setting values on the
configuration dev server: shorthand methods, and lower-level `set`
methods. Calling either of these is backed at `config.devServer.options`.
These configuration options are backed by JavaScript Maps, so calling `set`
will create unique mappings and overwrite existing values set at that
property name.

Starting with the shorthand methods:

```js
// host: String
devServer.host(host)
```

Specify a host to use. By default this is localhost.
<sup>[devServer host docs](https://webpack.js.org/configuration/dev-server/#devserver-host-cli-only)</sup>

Example:

```js
config.devServer.host('0.0.0.0');
```

---

```js
// port: Number
devServer.port(host)
```

Specify a port number to listen for requests on.
<sup>[devServer port docs](https://webpack.js.org/configuration/dev-server/#devserver-port-cli-only)</sup>

Example:

```js
config.devServer.port(8080);
```

---

```js
// isHttps: Boolean
devServer.https(isHttps)
```

By default dev-server will be served over HTTP. It can optionally be served over HTTP/2 with HTTPS.
<sup>[devServer https docs](https://webpack.js.org/configuration/dev-server/#devserver-https)</sup>

Example:

```js
config.devServer.https(true);
```

---

```js
// path: String | Boolean | Array
devServer.contentBase(path)
```

Tell the server where to serve content from. This is only necessary if you want to
serve static files. `devServer.publicPath` will be used to determine where the bundles
should be served from, and takes precedence.
<sup>[devServer contentBase docs](https://webpack.js.org/configuration/dev-server/#devserver-contentbase)</sup>

Examples:

```js
config.devServer.contentBase(path.join(__dirname, 'public'));

config.devServer.contentBase(false);

config.devServer.contentBase([
  path.join(__dirname, 'public'),
  path.join(__dirname, 'assets')
]);
```

---

```js
// useHistoryApiFallback: Boolean | Object
devServer.historyApiFallback(useHistoryApiFallback)
```

When using the HTML5 History API, the index.html page will likely
have be served in place of any 404 responses.
<sup>[devServer historyApiFallback docs](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback)</sup>

Examples:

```js
config.devServer.historyApiFallback(true);

config.devServer.historyApiFallback({
  rewrites: [
    { from: /^\/$/, to: '/views/landing.html' },
    { from: /^\/subpage/, to: '/views/subpage.html' },
    { from: /./, to: '/views/404.html' }
  ]
});
```

---

```js
// hotEnabled: Boolean
devServer.hot(hotEnabled)
```

Enable webpack's Hot Module Replacement feature.
<sup>[devServer hot docs](https://webpack.js.org/configuration/dev-server/#devserver-hot)</sup>

Example:

```js
config.devServer.hot(true);
```

---

```js
// stats: String | Object
devServer.stats(stats)
```

This option lets you precisely control what bundle information gets displayed.
This can be a nice middle ground if you want some bundle information, but not all of it.
<sup>[devServer stats docs](https://webpack.js.org/configuration/dev-server/#devserver-stats)</sup>

Examples:

```js
config.devServer.stats('errors-only');

config.devServer.stats({
  colors: true,
  quiet: true,
  assets: false
});
```

---

For options where a shorthand method does not exist, you can also set
dev server configuration settings by making calls to `.devServer.set`. These
configuration options are backed by JavaScript Maps, so calling `set`
will create unique mappings and overwrite existing values set at that
property name.

```js
config.devServer
  .set('hot', true)
  .set('lazy', true)
  .set('proxy', {
    '/api': 'http://localhost:3000'
  });
```

### Config.Node

Customize the Node.js environment using polyfills or mocks.

A `Config.Node` only provides an API for setting configuration properties
based on the [Webpack docs](https://webpack.js.org/configuration/node/).

Example:

```js
config.node
  .set('console', false)
  .set('global', true)
  .set('Buffer', true)
  .set('__filename', 'mock')
  .set('__dirname', 'mock')
  .set('setImmediate', true);
```

### Config.Resolve

`Config.Resolve` currently only has shorthand interfaces for `modules` and `extensions`.
You will need to use the low-level `.set` API to change other property at this time.
<sup>[resolve docs](https://webpack.js.org/configuration/resolve/#resolve)</sup>

Examples:

```js
config.resolve
  .set('mainFiles', 'index')
  .set('enforceExtension', false);
```

### Config.Resolve.modules

`Resolve.modules` are backed by JavaScript Sets,
so calling `add` will only add unique values, i.e. calling `add` many times
with the same value will only create a single module for that value.


```js
// entryPath: String
resolve.modules.add(path)
```

Add a path that tells Webpack what directories should be searched when resolving modules.
<sup>[resolve modules docs](https://webpack.js.org/configuration/resolve/#resolve-modules)</sup>

Examples:

```js
config.resolve.modules
  .add(path.join(process.cwd(), 'node_modules'))
  .add(path.join(__dirname, '../node_modules'));
```

---

```js
resolve.modules.clear()
```

Removes all specified paths from resolve modules.

Example:

```js
// Previously added resolve module paths
config.resolve.modules
  .add(path.join(process.cwd(), 'node_modules'))
  .add(path.join(__dirname, '../node_modules'));

// Remove all resolve module paths
config.resolve.modules.clear();
```

---

```js
// path: String
resolve.modules.delete(path)
```

Removes a single path from resolve modules.

Example:

```js
// Previously added resolve module paths
config.resolve.modules
  .add(path.join(process.cwd(), 'node_modules'))
  .add(path.join(__dirname, '../node_modules'));

// Remove a single resolve module path
config.resolve.modules.delete(path.join(process.cwd(), 'node_modules'));
```

---

```js
// path: String
// returns: Boolean
entry.has(path)
```

Returns `true` or `false` depending on whether the path was specified in resolve modules.

Examples:

```js
// Previously added resolve module paths
config.resolve.modules
  .add(path.join(process.cwd(), 'node_modules'))
  .add(path.join(__dirname, '../node_modules'));

config.resolve.modules.has(path.join(process.cwd(), 'node_modules')); // true
config.resolve.modules.has('/usr/bin'); // false
```

---

```js
// returns: Array
resolve.modules.values()
```

Returns an array of all the paths in resolve modules.

Examples:

```js
// Previously added resolve module paths
config.resolve.modules
  .add(path.join(process.cwd(), 'node_modules'))
  .add(path.join(__dirname, '../node_modules'));

config.resolve.modules
  .values()
  .map(path => console.log(path));
```

### Resolve.Extensions

This API is identical to the `Resolve.Modules` API, except the values
stored should be file extensions to automatically resolve instead of module resolution paths.

See the [Webpack docs](https://webpack.js.org/configuration/resolve/#resolve-extensions) for details.

### ResolveLoader.Modules

This API is identical to the `Resolve.Modules` API, except the values
stored should be paths for Webpack to resolve loaders.

See the [Webpack docs](https://webpack.js.org/configuration/resolve/#resolveloader) for details.

### ResolveLoader.*

Any other properties you wish to set on `resolveLoader` can be done through the `.set` API,
just like [`resolve.set`](#Config.Resolve).
