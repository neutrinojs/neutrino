# What are presets?

A preset is a Webpack- or Neutrino-compatible configuration capable of building or modifying
the build process for a project. Neutrino provides a few core presets to quickly get
started building some popular project types, but anyone can inherit, extend, and modify these
presets and tailor them to their project preferences. You can even create your own
presets from scratch.

If you are familiar with Babel presets, Neutrino presets work similarly. For example,
given the Babel preset `babel-preset-react`, you can compile React code with JSX
to vanilla JavaScript calls. Neutrino adopts this same concept. Many more aspects of
development surround building a complete React project, for which Webpack is commonly used.
By encapsulating the common needs of a project type into a preset, Neutrino allows you to
avoid the upfront cost of configuring and instead focus on project development.

Not every project is the same, and oftentimes small tweaks need to be made to the build
configuration in order to meet this need. Fortunately Neutrino presets can be modified and
extended directly from the project you are building. No need to be locked in to a particular
pattern, and no escape hatches that force you into maintaining the entire configuration should
you need to make changes.

Presets can be easily distributing by publishing them to npm or GitHub and installing them
in your project. This also allows others to discover and build projects based on your own
presets.

### Why not a boilerplate or alternative?

Boilerplates are great resources for scaffolding out application-specific code which
would be difficult or tedious to generate for every project. Unfortunately many projects
also bake in build configuration into this process, causing a lot of duplication. If you
need to make a change to your build steps, you are forced to make that change across all
your similar projects. Using a preset rather than a boilerplate keeps this process DRY.

Tools like [Create React App](https://github.com/facebookincubator/create-react-app) have
been fantastic improvements to the tooling ecosystem, but unfortunately only works on specific
environments like React, and do not allow simple extensibility of the build configuration. To
answer this new and similar projects are cropping up to build different types of projects,
often duplicating efforts which miss out on the best practices to share with the other project
types.
