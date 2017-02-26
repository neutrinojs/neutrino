# FAQ

### Why not a boilerplate or alternative?

Boilerplates are great resources for scaffolding out application-specific code which
would be difficult or tedious to generate for every project. Unfortunately many projects
also bake in build configuration into this process, causing a lot of duplication. If you
need to make a change to your build steps, you are forced to make that change across all
your similar projects. Using a preset rather than a boilerplate keeps this process DRY.

Tools like [Create React App](https://github.com/facebookincubator/create-react-app) have
been fantastic improvements to the tooling ecosystem, but unfortunately only work on specific
environments like React, and do not allow simple extensibility of the build configuration. To
answer this, new and similar projects are cropping up to build different types of projects,
often duplicating efforts which miss out on the best practices to share with the other project
types.

### What is the added value versus all the boilerplate projects out there?

The proliferation of boilerplate and meta-packages is one thing we are trying to reduce. These types of projects 
are great, and do serve a purpose. But what if you wanted to make a configuration change across all your
projects? You must make config changes in many places, including the original boilerplate, whereas presets
give you the power to confine these changes to a single package. Some of these projects also make a trade-off
between ease of set up and black-boxing the configuration. Once you decide to make a configuration change,
you are forced to maintain the entire configuration and its dependencies in perpetuity. We believe Neutrino
represents a good balance between ease of set up and future extensibility.
