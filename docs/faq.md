# FAQ

### Why not a boilerplate or alternative?

Boilerplates are great resources for scaffolding out application-specific code which
would be difficult or tedious to generate for every project. Unfortunately many projects
also bake in build configuration into this process, causing a lot of duplication. If you
need to make a change to your build steps, you are forced to make that change across all
your similar projects. Using a preset rather than a boilerplate keeps this process DRY.

Tools like [Create React App](https://github.com/facebook/create-react-app) have
been fantastic improvements to the tooling ecosystem, but unfortunately only work on specific
environments like React, and do not allow simple extensibility of the build configuration. To
answer this, new and similar projects are cropping up to build different types of projects,
often duplicating efforts and missing out on opportunities to share best practices with the other project
types.

### What is the added value versus all the boilerplate projects out there?

The proliferation of boilerplate and meta-packages is one thing we are trying to reduce. These types of projects
are great and do serve a purpose. But what if you wanted to make a configuration change across all your
projects? You must make config changes in many places, including the original boilerplate, whereas presets
give you the power to confine these changes to a single package. Some of these projects also make a trade-off
between ease of set up and black-boxing the configuration. Once you decide to make a configuration change,
you are forced to maintain the entire configuration and its dependencies in perpetuity. We believe Neutrino
represents a good balance between ease of set up and future extensibility.

### Why don't presets use a normal webpack configuration object instead of the chaining API?

The webpack configuration works well when it is embedded into a single project, and it is the only configuration
file to maintain. Once the configuration is no longer co-located with the project and needs to be extended or
modified across different projects, it becomes very messy to make those modifications.

For example, let's say that a preset instead used the webpack object configuration and added an instance of the
`EnvironmentPlugin`:

```js
config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']));
```

If you wanted to extend this plugin in your own project to add more environment variables, you would most likely
resort to either adding a new instance of the `EnvironmentPlugin` by requiring webpack yourself, or looping through
webpack's plugin array, removing the plugin, and re-instantiating it with your own arguments.

```js
config.plugins = config.plugins.map(plugin => {
  if (plugin.constructor.name !== 'EnvironmentPlugin') {
    return plugin;
  }
  
  return new webpack.EnvironmentPlugin([...plugin.keys, ...customEnvironmentVariables]);
});
```

This forces a much higher maintenance burden on your project, and this is only a very simple example. Modifying
loaders created from raw webpack configuration objects can be **much** more unwieldy.

Using [webpack-chain](https://github.com/neutrinojs/webpack-chain) affords Neutrino the ability to identify and
manipulate parts of the configuration without resorting to object and array manipulation hacks, something not currently
possible when working with raw webpack configuration data.

### Can I just re-use my existing webpack configuration?

The Neutrino configuration does let you merge a configuration object, but does not accept a normal webpack configuration
out of the box. Since Neutrino uses webpack-chain and enforces naming of plugins, rules, and loaders, you must use an
object that corresponds with this "schema". Typically this would involve transforming your webpack configuration to nest
entities requiring a name into an object which maps the name to the entity.

In short, you must transform your webpack configuration in order to merge it into the Neutrino configuration cleanly.

### What is the difference between middleware and presets?

The term "presets" are a hold-over from Neutrino pre-v5. Presets **are** middleware, the difference in reality is in
name only. To keep the term "presets" relevant, we typically want to use it when referring to major project types:
React projects, Node.js projects, composite middleware (a conglomeration of many middlewares), etc.

The takeaway: most middleware can just be middleware, and use the term preset for major project types or
composite middleware.
