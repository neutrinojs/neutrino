# webpack-chain: Neutrino configuration API

Use a chaining API to generate and simplify the modification of
webpack configurations.

This documentation corresponds to v6 of webpack-chain, which Neutrino utilizes.

_Note: while webpack-chain is utilized extensively in Neutrino, the package is
completely standalone and can be used by any project.
See the [webpack-chain](https://github.com/neutrinojs/webpack-chain) repository
for standalone documentation._

## Introduction

webpack's core configuration is based on creating and modifying a
potentially unwieldy JavaScript object. While this is OK for configurations
on individual projects, trying to share these objects across projects and
make subsequent modifications gets messy, as you need to have a deep
understanding of the underlying object structure to make those changes.

`webpack-chain` attempts to improve this process by providing a chainable or
fluent API for creating and modifying webpack configurations. Key portions
of the API can be referenced by user-specified names, which helps to
standardize how to modify a configuration across projects.

This is easier explained through the examples following.

## Getting Started

In the Neutrino API, the `config` property is an instance of webpack-chain. For this guide,
our example base configuration will be `.neutrinorc.js` in the root of our project directory.
This can utilize either the [Object format](./middleware.md#object-format) or
[Function format](./middleware.md#function-format) to access the Neutrino API:

```js
// .neutrinorc.js

// Object format
module.exports = {
  use: [
    (neutrino) => {
      // access the Neutrino API
    }
  ]
};

// Function format
module.exports = (neutrino) => {
  // access the Neutrino API
};
```

**In our examples we will utilize the Function format for sake of space.**

```js
// Make configuration changes using the chaining API.
// Every API call tracks a change to the stored configuration.
module.exports = (neutrino) => {
  neutrino.config
    // Interact with entry points
    .entry('index')
      .add('src/index.js')
      .end()

    // Modify output settings
    .output
      .path('dist')
      .filename('[name].bundle.js');

  // Create named rules which can be modified later or
  // in other middleware/presets
  neutrino.config.module
    .rule('lint')
      .test(/\.js$/)
      .pre()
      .include
        .add('src')
        .end()
      // Even create named uses (loaders)
      .use('eslint')
        .loader('eslint-loader')
        .options({
          rules: {
            semi: 'off'
          }
        });

  neutrino.config.module
    .rule('compile')
      .test(/\.js$/)
      .include
        .add('src')
        .add('test')
        .end()
      .use('babel')
        .loader('babel-loader')
        .options({
          presets: [
            ['@babel/preset-env', { modules: false }]
          ]
        });

  // Create named plugins too!
  neutrino.config
    .plugin('clean')
      .use(CleanPlugin);
};
```

## ChainedMap

One of the core API interfaces in Neutrino configuration is a `ChainedMap`. A
`ChainedMap` operates similar to a JavaScript Map, with some conveniences for
chaining and generating configuration. If a property is marked as being a
`ChainedMap`, it will have an API and methods as described below:

**Unless stated otherwise, these methods will return the `ChainedMap`, allowing
you to chain these methods.**

```js
// Remove all entries from a Map.
clear()
```

```js
// Remove a single entry from a Map given its key.
// key: *
delete(key)
```

```js
// Fetch the value from a Map located at the corresponding key.
// key: *
// returns: value
get(key)
```

```js
// Fetch the value from a Map located at the corresponding key.
// If the key is missing, the key is set to the result of function fn.
// key: *
// fn: Function () -> value
// returns: value
getOrCompute(key, fn)
```

```js
// Set a value on the Map stored at the `key` location.
// key: *
// value: *
set(key, value)
```

```js
// Returns `true` or `false` based on whether a Map as has a value set at a
// particular key.
// key: *
// returns: Boolean
has(key)
```

```js
// Returns an array of all the values stored in the Map.
// returns: Array
values()
```

```js
// Returns an object of all the entries in the backing Map
// where the key is the object property, and the value
// corresponding to the key. Will return `undefined` if the backing
// Map is empty.
// This will order properties by their name if the value is
// a ChainedMap that used .before() or .after().
// returns: Object, undefined if empty
entries()
````

```js
// Provide an object which maps its properties and values
// into the backing Map as keys and values.
// You can also provide an array as the second argument
// for property names to omit from being merged.
// obj: Object
// omit: Optional Array
merge(obj, omit)
```

```js
// Execute a function against the current configuration context
// handler: Function -> ChainedMap
  // A function which is given a single argument of the ChainedMap instance
batch(handler)
```

```js
// Conditionally execute a function to continue configuration
// condition: Boolean
// whenTruthy: Function -> ChainedMap
  // invoked when condition is truthy, given a single argument of the ChainedMap instance
// whenFalsy: Optional Function -> ChainedMap
  // invoked when condition is falsy, given a single argument of the ChainedMap instance
when(condition, whenTruthy, whenFalsy)
```

## ChainedSet

Another of the core API interfaces in Neutrino configuration is a `ChainedSet`. A
`ChainedSet` operates similar to a JavaScript Set, with some conveniences for
chaining and generating configuration. If a property is marked as being a
`ChainedSet`, it will have an API and methods as described below:

**Unless stated otherwise, these methods will return the `ChainedSet`, allowing
you to chain these methods.**

```js
// Add/append a value to the end of a Set.
// value: *
add(value)
```

```js
// Add a value to the beginning of a Set.
// value: *
prepend(value)
```

```js
// Remove all values from a Set.
clear()
```

```js
// Remove a specific value from a Set.
// value: *
delete(value)
```

```js
// Returns `true` or `false` based on whether or not the
// backing Set contains the specified value.
// value: *
// returns: Boolean
has(value)
```

```js
// Returns an array of values contained in the backing Set.
// returns: Array
values()
```

```js
// Concatenates the given array to the end of the backing Set.
// arr: Array
merge(arr)
```

```js
// Execute a function against the current configuration context
// handler: Function -> ChainedSet
  // A function which is given a single argument of the ChainedSet instance
batch(handler)
```

```js
// Conditionally execute a function to continue configuration
// condition: Boolean
// whenTruthy: Function -> ChainedSet
  // invoked when condition is truthy, given a single argument of the ChainedSet instance
// whenFalsy: Optional Function -> ChainedSet
  // invoked when condition is falsy, given a single argument of the ChainedSet instance
when(condition, whenTruthy, whenFalsy)
```

## Shorthand methods

A number of shorthand methods exist for setting a value on a `ChainedMap`
with the same key as the shorthand method name.
For example, `devServer.hot` is a shorthand method, so it can be used as:

```js
// A shorthand method for setting a value on a ChainedMap
neutrino.config.devServer.hot(true);

// This would be equivalent to:
neutrino.config.devServer.set('hot', true);
```

A shorthand method is chainable, so calling it will return the original
instance, allowing you to continue to chain.

### Config

Moving to deeper points in the configuration API will change the context of what you
are modifying. You can move back to the higher context by either referencing
the top-level `neutrino.config` again, or by calling `.end()` to move up one level.
If you are familiar with jQuery, `.end()` works similarly. All API calls
will return the API instance at the current context unless otherwise
specified. This is so you may chain API calls continuously if desired.

For details on the specific values that are valid for all shorthand and
low-level methods, please refer to their corresponding name in the
[webpack docs hierarchy](https://webpack.js.org/configuration/).

```js
Config : ChainedMap
```

#### Config shorthand methods

```js
neutrino.config
  .amd(amd)
  .bail(bail)
  .cache(cache)
  .devtool(devtool)
  .context(context)
  .externals(externals)
  .loader(loader)
  .mode(mode)
  .name(name)
  .parallelism(parallelism)
  .profile(profile)
  .recordsPath(recordsPath)
  .recordsInputPath(recordsInputPath)
  .recordsOutputPath(recordsOutputPath)
  .stats(stats)
  .target(target)
  .watch(watch)
  .watchOptions(watchOptions)
```

#### Config entryPoints

```js
// Backed at config.entryPoints : ChainedMap
neutrino.config.entry(name) : ChainedSet

neutrino.config
  .entry(name)
    .add(value)
    .add(value)

neutrino.config
  .entry(name)
    .clear()

// Using low-level config.entryPoints:

neutrino.config.entryPoints
  .get(name)
    .add(value)
    .add(value)

neutrino.config.entryPoints
  .get(name)
    .clear()
```

#### Config output: shorthand methods

```js
neutrino.config.output : ChainedMap

neutrino.config.output
  .auxiliaryComment(auxiliaryComment)
  .chunkFilename(chunkFilename)
  .chunkLoadTimeout(chunkLoadTimeout)
  .crossOriginLoading(crossOriginLoading)
  .devtoolFallbackModuleFilenameTemplate(devtoolFallbackModuleFilenameTemplate)
  .devtoolLineToLine(devtoolLineToLine)
  .devtoolModuleFilenameTemplate(devtoolModuleFilenameTemplate)
  .filename(filename)
  .hashFunction(hashFunction)
  .hashDigest(hashDigest)
  .hashDigestLength(hashDigestLength)
  .hashSalt(hashSalt)
  .hotUpdateChunkFilename(hotUpdateChunkFilename)
  .hotUpdateFunction(hotUpdateFunction)
  .hotUpdateMainFilename(hotUpdateMainFilename)
  .jsonpFunction(jsonpFunction)
  .library(library)
  .libraryExport(libraryExport)
  .libraryTarget(libraryTarget)
  .path(path)
  .pathinfo(pathinfo)
  .publicPath(publicPath)
  .sourceMapFilename(sourceMapFilename)
  .sourcePrefix(sourcePrefix)
  .strictModuleExceptionHandling(strictModuleExceptionHandling)
  .umdNamedDefine(umdNamedDefine)
```

#### Config resolve: shorthand methods

```js
neutrino.config.resolve : ChainedMap

neutrino.config.resolve
  .cachePredicate(cachePredicate)
  .cacheWithContext(cacheWithContext)
  .enforceExtension(enforceExtension)
  .enforceModuleExtension(enforceModuleExtension)
  .unsafeCache(unsafeCache)
  .symlinks(symlinks)
```

#### Config resolve alias

```js
neutrino.config.resolve.alias : ChainedMap

neutrino.config.resolve.alias
  .set(key, value)
  .delete(key)
  .clear()
```

#### Config resolve modules

```js
neutrino.config.resolve.modules : ChainedSet

neutrino.config.resolve.modules
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve aliasFields

```js
neutrino.config.resolve.aliasFields : ChainedSet

neutrino.config.resolve.aliasFields
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve descriptionFields

```js
neutrino.config.resolve.descriptionFields : ChainedSet

neutrino.config.resolve.descriptionFields
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve extensions

```js
neutrino.config.resolve.extensions : ChainedSet

neutrino.config.resolve.extensions
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve mainFields

```js
neutrino.config.resolve.mainFields : ChainedSet

neutrino.config.resolve.mainFields
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve mainFiles

```js
neutrino.config.resolve.mainFiles : ChainedSet

neutrino.config.resolve.mainFiles
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolveLoader

The API for `neutrino.config.resolveLoader` is identical to `neutrino.config.resolve` with
the following additions:

#### Config resolveLoader moduleExtensions

```js
neutrino.config.resolveLoader.moduleExtensions : ChainedSet

neutrino.config.resolveLoader.moduleExtensions
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolveLoader packageMains

```js
neutrino.config.resolveLoader.packageMains : ChainedSet

neutrino.config.resolveLoader.packageMains
  .add(value)
  .prepend(value)
  .clear()
```

#### Config performance: shorthand methods

```js
neutrino.config.performance : ChainedMap

neutrino.config.performance
  .hints(hints)
  .maxEntrypointSize(maxEntrypointSize)
  .maxAssetSize(maxAssetSize)
  .assetFilter(assetFilter)
```

#### Configuring optimizations: shorthand methods

```js
neutrino.config.optimization : ChainedMap

neutrino.config.optimization
  .concatenateModules(concatenateModules)
  .flagIncludedChunks(flagIncludedChunks)
  .mergeDuplicateChunks(mergeDuplicateChunks)
  .minimize(minimize)
  .minimizer(minimizer)
  .namedChunks(namedChunks)
  .namedModules(namedModules)
  .nodeEnv(nodeEnv)
  .noEmitOnErrors(noEmitOnErrors)
  .occurrenceOrder(occurrenceOrder)
  .portableRecords(portableRecords)
  .providedExports(providedExports)
  .removeAvailableModules(removeAvailableModules)
  .removeEmptyChunks(removeEmptyChunks)
  .runtimeChunk(runtimeChunk)
  .sideEffects(sideEffects)
  .splitChunks(splitChunks)
  .usedExports(usedExports)
```

#### Config optimization minimizers

```js
// Backed at neutrino.config.optimization.minimizers
neutrino.config.optimization
  .minimizer(name) : ChainedMap
```

#### Config optimization minimizers: adding

_NOTE: Do not use `new` to create the minimizer plugin, as this will be done for you._

```js
neutrino.config.optimization
  .minimizer(name)
  .use(WebpackPlugin, args)

// Examples

neutrino.config.optimization
  .minimizer('css')
  .use(OptimizeCSSAssetsPlugin, [{ cssProcessorOptions: { safe: true } }])

// Minimizer plugins can also be specified by their path, allowing the expensive require()s to be
// skipped in cases where the plugin or webpack configuration won't end up being used.
neutrino.config.optimization
  .minimizer('css')
  .use(require.resolve('optimize-css-assets-webpack-plugin'), [{ cssProcessorOptions: { safe: true } }])

```

#### Config optimization minimizers: modify arguments

```js
neutrino.config.optimization
  .minimizer(name)
  .tap(args => newArgs)

// Example
neutrino.config.optimization
  .minimizer('css')
  .tap(args => [...args, { cssProcessorOptions: { safe: false } }])
```

#### Config optimization minimizers: modify instantiation

```js
neutrino.config.optimization
  .minimizer(name)
  .init((Plugin, args) => new Plugin(...args));
```

#### Config optimization minimizers: removing

```js
neutrino.config.optimization.minimizers.delete(name)
```

#### Config plugins

```js
// Backed at config.plugins
neutrino.config.plugin(name) : ChainedMap
```

#### Config plugins: adding

_NOTE: Do not use `new` to create the plugin, as this will be done for you._

```js
neutrino.config
  .plugin(name)
  .use(WebpackPlugin, args)

// Examples

neutrino.config
  .plugin('hot')
  .use(webpack.HotModuleReplacementPlugin);

// Plugins can also be specified by their path, allowing the expensive require()s to be
// skipped in cases where the plugin or webpack configuration won't end up being used.
neutrino.config
  .plugin('env')
  .use(require.resolve('webpack/lib/EnvironmentPlugin'), [{ 'VAR': false }]);
```

#### Config plugins: modify arguments

```js
neutrino.config
  .plugin(name)
  .tap(args => newArgs)

// Example
neutrino.config
  .plugin('env')
  .tap(args => [...args, 'SECRET_KEY']);
```

#### Config plugins: modify instantiation

```js
neutrino.config
  .plugin(name)
  .init((Plugin, args) => new Plugin(...args));
```

#### Config plugins: removing

```js
neutrino.config.plugins.delete(name)
```

#### Config plugins: ordering before

Specify that the current `plugin` context should operate before another named
`plugin`. You cannot use both `.before()` and `.after()` on the same plugin.

```js
neutrino.config
  .plugin(name)
    .before(otherName)

// Example

neutrino.config
  .plugin('html-template')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin)
    .before('html-template');
```

#### Config plugins: ordering after

Specify that the current `plugin` context should operate after another named
`plugin`. You cannot use both `.before()` and `.after()` on the same plugin.

```js
neutrino.config
  .plugin(name)
    .after(otherName)

// Example

neutrino.config
  .plugin('html-template')
    .after('script-ext')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin);
```

#### Config resolve plugins

```js
// Backed at config.resolve.plugins
neutrino.config.resolve.plugin(name) : ChainedMap
```

#### Config resolve plugins: adding

_NOTE: Do not use `new` to create the plugin, as this will be done for you._

```js
neutrino.config.resolve
  .plugin(name)
  .use(WebpackPlugin, args)
```

#### Config resolve plugins: modify arguments

```js
neutrino.config.resolve
  .plugin(name)
  .tap(args => newArgs)
```

#### Config resolve plugins: modify instantiation

```js
neutrino.config.resolve
  .plugin(name)
  .init((Plugin, args) => new Plugin(...args))
```

#### Config resolve plugins: removing

```js
neutrino.config.resolve.plugins.delete(name)
```

#### Config resolve plugins: ordering before

Specify that the current `plugin` context should operate before another named
`plugin`. You cannot use both `.before()` and `.after()` on the same resolve
plugin.

```js
neutrino.config.resolve
  .plugin(name)
    .before(otherName)

// Example

neutrino.config.resolve
  .plugin('beta')
    .use(BetaWebpackPlugin)
    .end()
  .plugin('alpha')
    .use(AlphaWebpackPlugin)
    .before('beta');
```

#### Config resolve plugins: ordering after

Specify that the current `plugin` context should operate after another named
`plugin`. You cannot use both `.before()` and `.after()` on the same resolve
plugin.

```js
neutrino.config.resolve
  .plugin(name)
    .after(otherName)

// Example

neutrino.config.resolve
  .plugin('beta')
    .after('alpha')
    .use(BetaWebpackTemplate)
    .end()
  .plugin('alpha')
    .use(AlphaWebpackPlugin);
```

#### Config node

```js
neutrino.config.node : ChainedMap

neutrino.config.node
  .set('__dirname', 'mock')
  .set('__filename', 'mock');
```

#### Config devServer

```js
neutrino.config.devServer : ChainedMap
```

#### Config devServer allowedHosts

```js
neutrino.config.devServer.allowedHosts : ChainedSet

neutrino.config.devServer.allowedHosts
  .add(value)
  .prepend(value)
  .clear()
```

#### Config devServer: shorthand methods

```js
neutrino.config.devServer
  .bonjour(bonjour)
  .clientLogLevel(clientLogLevel)
  .color(color)
  .compress(compress)
  .contentBase(contentBase)
  .disableHostCheck(disableHostCheck)
  .filename(filename)
  .headers(headers)
  .historyApiFallback(historyApiFallback)
  .host(host)
  .hot(hot)
  .hotOnly(hotOnly)
  .https(https)
  .inline(inline)
  .info(info)
  .lazy(lazy)
  .noInfo(noInfo)
  .open(open)
  .openPage(openPage)
  .overlay(overlay)
  .pfx(pfx)
  .pfxPassphrase(pfxPassphrase)
  .port(port)
  .progress(progress)
  .proxy(proxy)
  .public(public)
  .publicPath(publicPath)
  .quiet(quiet)
  .setup(setup)
  .socket(socket)
  .staticOptions(staticOptions)
  .stats(stats)
  .stdin(stdin)
  .useLocalIp(useLocalIp)
  .watchContentBase(watchContentBase)
  .watchOptions(watchOptions)
```

#### Config module

```js
neutrino.config.module : ChainedMap
```

#### Config module: shorthand methods

```js
neutrino.config.module : ChainedMap

neutrino.config.module
  .noParse(noParse)
```

#### Config module rules: shorthand methods

```js
neutrino.config.module.rules : ChainedMap

neutrino.config.module
  .rule(name)
    .test(test)
    .pre()
    .post()
    .enforce(preOrPost)
```

#### Config module rules uses (loaders): creating

```js
neutrino.config.module.rules{}.uses : ChainedMap

neutrino.config.module
  .rule(name)
    .use(name)
      .loader(loader)
      .options(options)

// Example

neutrino.config.module
  .rule('compile')
    .use('babel')
      .loader('babel-loader')
      .options({ presets: ['@babel/preset-env'] });
```

#### Config module rules uses (loaders): modifying options

```js
neutrino.config.module
  .rule(name)
    .use(name)
      .tap(options => newOptions)

// Example

neutrino.config.module
  .rule('compile')
    .use('babel')
      .tap(options => merge(options, {
        plugins: ['@babel/plugin-proposal-class-properties']
      }));
```

#### Config module rules oneOfs (conditional rules):

```js
neutrino.config.module.rules{}.oneOfs : ChainedMap<Rule>

neutrino.config.module
  .rule(name)
    .oneOf(name)

// Example

neutrino.config.module
  .rule('css')
    .oneOf('inline')
      .resourceQuery(/inline/)
      .use('url')
        .loader('url-loader')
        .end()
      .end()
    .oneOf('external')
      .resourceQuery(/external/)
      .use('file')
        .loader('file-loader')
```

#### Config module rules oneOfs (conditional rules): ordering before

Specify that the current `oneOf` context should operate before another named
`oneOf`. You cannot use both `.before()` and `.after()` on the same `oneOf`.

```js
neutrino.config.module
  .rule(name)
    .oneOf(name)
      .before()

// Example

neutrino.config.module
  .rule('scss')
    .test(/\.scss$/)
    .oneOf('normal')
      .use('sass')
        .loader('sass-loader')
        .end()
      .end()
    .oneOf('sass-vars')
      .before('normal')
      .resourceQuery(/\?sassvars/)
      .use('sass-vars')
        .loader('sass-vars-to-js-loader')
```

#### Config module rules oneOfs (conditional rules): ordering after

Specify that the current `oneOf` context should operate after another named
`oneOf`. You cannot use both `.before()` and `.after()` on the same `oneOf`.

```js
neutrino.config.module
  .rule(name)
    .oneOf(name)
      .after()

// Example

neutrino.config.module
  .rule('scss')
    .test(/\.scss$/)
    .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use('vue-style')
        .loader('vue-style-loader')
        .end()
      .end()
    .oneOf('normal')
      .use('sass')
        .loader('sass-loader')
        .end()
      .end()
    .oneOf('sass-vars')
      .after('vue')
      .resourceQuery(/\?sassvars/)
      .use('sass-vars')
        .loader('sass-vars-to-js-loader')
```

---

### Merging Config

Neutrino config supports merging in an object to the configuration instance which
matches a layout similar to how the configuration schema is laid out. Note that
this is not a webpack configuration object, but you may transform a webpack
configuration object before providing it to Neutrino configuration to match its layout.

```js
neutrino.config.merge({ devtool: 'source-map' });

neutrino.config.get('devtool') // "source-map"
```

```js
// Neutrino configuration "schematic"
// Merging an object into Neutrino configuration
// should have any properties you set follow this
// "schematic" format.
neutrino.config.merge({
  [key]: value,

  amd,
  bail,
  cache,
  context,
  devtool,
  externals,
  loader,
  mode,
  parallelism,
  profile,
  recordsPath,
  recordsInputPath,
  recordsOutputPath,
  stats,
  target,
  watch,
  watchOptions,

  entry: {
    [name]: [...values]
  },

  plugin: {
    [name]: {
      plugin: WebpackPlugin,
      args: [...args],
      before,
      after
    }
  },

  devServer: {
    [key]: value,

    clientLogLevel,
    compress,
    contentBase,
    filename,
    headers,
    historyApiFallback,
    host,
    hot,
    hotOnly,
    https,
    inline,
    lazy,
    noInfo,
    overlay,
    port,
    proxy,
    quiet,
    setup,
    stats,
    watchContentBase
  },

  node: {
    [key]: value
  },

  optimization: {
    concatenateModules,
    flagIncludedChunks,
    mergeDuplicateChunks,
    minimize,
    minimizer,
    namedChunks,
    namedModules,
    nodeEnv,
    noEmitOnErrors,
    occurrenceOrder,
    portableRecords,
    providedExports,
    removeAvailableModules,
    removeEmptyChunks,
    runtimeChunk,
    sideEffects,
    splitChunks,
    usedExports,
  },

  performance: {
    [key]: value,

    hints,
    maxEntrypointSize,
    maxAssetSize,
    assetFilter
  },

  resolve: {
    [key]: value,

    alias: {
      [key]: value
    },
    aliasFields: [...values],
    descriptionFields: [...values],
    extensions: [...values],
    mainFields: [...values],
    mainFiles: [...values],
    modules: [...values],

    plugin: {
      [name]: {
        plugin: WebpackPlugin,
        args: [...args],
        before,
        after
      }
    }
  },

  resolveLoader: {
    [key]: value,

    alias: {
      [key]: value
    },
    aliasFields: [...values],
    descriptionFields: [...values],
    extensions: [...values],
    mainFields: [...values],
    mainFiles: [...values],
    modules: [...values],
    moduleExtensions: [...values],
    packageMains: [...values],

    plugin: {
      [name]: {
        plugin: WebpackPlugin,
        args: [...args],
        before,
        after
      }
    }
  },

  module: {
    [key]: value,

    rule: {
      [name]: {
        [key]: value,

        enforce,
        issuer,
        parser,
        resource,
        resourceQuery,
        test,

        include: [...paths],
        exclude: [...paths],

        oneOf: {
          [name]: Rule
        },

        use: {
          [name]: {
            loader: LoaderString,
            options: LoaderOptions,
            before,
            after
          }
        }
      }
    }
  }
})
```

### Conditional configuration

When working with instances of `ChainedMap` and `ChainedSet`, you can perform
conditional configuration using `when`. You must specify an expression to
`when()` which will be evaluated for truthiness or falsiness. If the expression
is truthy, the first function argument will be invoked with an instance of the
current chained instance. You can optionally provide a second function to be
invoked when the condition is falsy, which is also given the current chained
instance.

```js
// Example: Only add minify plugin during production
neutrino.config
  .when(process.env.NODE_ENV === 'production', config => {
    config
      .plugin('minify')
      .use(BabelMinifyWebpackPlugin);
  });
```

```js
// Example: Only add minify plugin during production,
// otherwise set devtool to source-map
neutrino.config
  .when(process.env.NODE_ENV === 'production',
    config => config.plugin('minify').use(BabelMinifyWebpackPlugin),
    config => config.devtool('source-map')
  );
```

### Inspecting generated configuration

You can inspect the generated webpack config using `neutrino.config.toString()`. This
will generate a stringified version of the config with comment hints for named
rules, uses and plugins:

``` js
neutrino.config
  .module
    .rule('compile')
      .test(/\.js$/)
      .use('babel')
        .loader('babel-loader');

neutrino.config.toString({ configPrefix: 'neutrino.config' });

/*
{
  module: {
    rules: [
      /* neutrino.config.module.rule('compile') */
      {
        test: /\.js$/,
        use: [
          /* neutrino.config.module.rule('compile').use('babel') */
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}
*/
```

By default the generated string cannot be used directly as real webpack config
if it contains functions and plugins that need to be required. In order to
generate usable config, you can customize how functions and plugins are
stringified by setting a special `__expression` property on them:

``` js
class MyPlugin {}
MyPlugin.__expression = `require('my-plugin')`;

function myFunction () {}
myFunction.__expression = `require('my-function')`;

neutrino.config
  .plugin('example')
    .use(MyPlugin, [{ fn: myFunction }]);

neutrino.config.toString({ configPrefix: 'neutrino.config' });

/*
{
  plugins: [
    new (require('my-plugin'))({
      fn: require('my-function')
    })
  ]
}
*/
```

Plugins specified via their path will have their `require()` statement generated
automatically:

``` js
neutrino.config
  .plugin('env')
    .use(require.resolve('webpack/lib/ProvidePlugin'), [{ jQuery: 'jquery' }])

neutrino.config.toString({ configPrefix: 'neutrino.config' });

/*
{
  plugins: [
    new (require('/foo/bar/src/node_modules/webpack/lib/EnvironmentPlugin.js'))(
      {
        jQuery: 'jquery'
      }
    )
  ]
}
*/
```

You can also call `toString` as a static method on `Config` in order to
modify the configuration object prior to stringifying.

```js
Config.toString(
  {
    ...neutrino.config.toConfig(),
    module: {
      defaultRules: [
        {
          use: [
            {
              loader: 'banner-loader',
              options: { prefix: 'banner-prefix.txt' },
            },
          ],
        },
      ],
    },
  },
  {
    configPrefix: 'neutrino.config'
  }
)

/*
{
  plugins: [
    /* neutrino.config.plugin('foo') */
    new TestPlugin()
  ],
  module: {
    defaultRules: [
      {
        use: [
          {
            loader: 'banner-loader',
            options: {
              prefix: 'banner-prefix.txt'
            }
          }
        ]
      }
    ]
  }
}
*/
```
