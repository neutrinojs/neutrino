# Neutrino Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications
to the way your Neutrino preset is building your project. Neutrino provides two ways you can augment a preset in the
context of a project without resorting to creating and publishing an entirely independent preset.

### Simple Customization

By defining an object within your package.json at `neutrino`, Neutrino will merge this information with that provided by
your presets or middleware, overriding the configuration and options with your own preferences.

### Advanced Customization

You can also create a configuration override directly in your project which can extend the presets and middleware you
are using.

---

Continue for details on each technique.
