# Neutrino Base Preset [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]

This [neutrino](https://github.com/mozilla-neutrino/neutrino) preset is abstract and should not be
used directly to build a JavaScript project. Rather, this preset contains shared configuration that
is extended by all other core neutrino presets.

Modify this preset if there is shared configuration that should be propagated to all other core
neutrino presets. This preset contains the bulk of the shared Webpack and ESLint configuration.


# Technology

* [neutrino-preset-base](https://github.com/mozilla-neutrino/neutrino-preset-base)
* babel-preset-es2015: Polyfill ES2015 syntaxes

[npm-image]: https://badge.fury.io/js/neutrino-preset-base.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-base
[daviddm-image]: https://david-dm.org/mozilla-neutrino/neutrino-preset-base.svg
[daviddm-url]: https://david-dm.org/mozilla-neutrino/neutrino-preset-base
