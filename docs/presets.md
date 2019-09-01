# What are presets?

A preset is a Neutrino-compatible configuration capable of building, modifying
the build process, or interacting with a project as a result of building.
Neutrino provides a few core presets to quickly get started building some popular project
types, but anyone can inherit, extend, and modify these presets and tailor them to their project,
team, or company preferences. You can even create your own presets from scratch.

If you are familiar with Babel presets, Neutrino presets work similarly. For example,
given the Babel preset `@babel/preset-react`, you can compile React code with JSX
to vanilla JavaScript calls. Neutrino adopts this same concept by adapting webpack into
a tool that understands configurations-as-packages, i.e. presets. Many more aspects of
development surround building a complete React project, for which webpack is commonly used.
By encapsulating the common needs of a project type into a preset, Neutrino allows you to
avoid the upfront cost of configuring and instead focus on project development.

Not every project is the same, and oftentimes small tweaks need to be made to the build
configuration in order to meet this need. Fortunately Neutrino presets can be modified and
extended directly from the project you are building. No need to be locked in to a particular
pattern, and no escape hatches that force you into maintaining the entire configuration should
you need to make changes.

Presets can be easily distributed by publishing them to npm or GitHub and installing them
in your project. This also allows others to discover and build projects based on your own
presets.
