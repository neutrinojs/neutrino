# Project Layout

Out of the box, Neutrino presets expect a project to have a particular structure to make the
development process for new projects as quick as possible. This is broken up into four directories:

- Source code
- Static assets
- Build assets
- Testing

Each of these directories is set up via convention by a Neutrino preset, but each can be customized as
desired by overriding the preset's configuration or using a different preset. See
[Custom Configuration](./customization.md) for detailed instructions.

## Source Code

By default, Neutrino presets expect all project source code to live in a directory named `src` in the
root of the project. This includes compiled and imported JavaScript files, CSS stylesheets, images, and any other assets
that would be available to your compiled project.

When running your project or creating a build bundle, a preset will look for this `src` directory for
the main entry points of your application and use this as the relative location for finding other assets
necessary for creating your builds.

## Build Assets

When creating a build bundle, a preset will put the compiled assets, including any generated
JavaScript files, into a directory named `build` by default.

Normally most projects will exclude checking in this build directory to source control.
Be sure to add this directory to your project's `.gitignore`, `.hgignore`, or similar file.

## Testing

Neutrino presets by default expect all tests to be located in a directory named `test`. In order to make the
separation between tests and test fixtures or harnesses easier to differentiate, Neutrino presets also
usually look for test files ending in `_test.js` or `.test.js`. See your specific test preset for more
detailed information about running tests and other conventions.
