# Neutrino Vue preset

[![Greenkeeper badge](https://badges.greenkeeper.io/barraponto/neutrino-preset-vue.svg)](https://greenkeeper.io/)
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url]
[![Join Slack][slack-image]][slack-url]

`neutrino-preset-vue` is a Neutrino preset that adds basic support for
[Vue components][vuejs].

## Documentation

Install this preset to your development dependencies, then set it in
`.neutrinorc.js`. It should go after `neutrino-preset-web`, though it just needs
something to give it an entry point.

```js
  module.exports = {
    use: [
      "neutrino-preset-web",
      "neutrino-preset-vue"
    ],
    ...
  };
```

If you're using `neutrino-preset-lint` or any preset based on it,
this preset will add eslint plugin and rules for Vue components.

If you're using `neutrino-preset-stylelint` or any preset based on it,
this preset will add support for `<style>` tags in Vue components.

Just ensure the linter presets are loaded *before* this one.

## Support Object spread syntax

Vuex makes heavy use of object rest/spread, which is still a stage 3 ECMAScript
proposal. If you want to use it, you have to add the
[babel plugin][babel-object-rest-spread-plugin] for it. Neutrino Web Preset
users can just add it to that preset through an option in `.neutrinorc.js`.


```js
  module.exports = {
    use: [
      ["neutrino-preset-web", {
        babel: {
          plugins: [require.resolve('babel-plugin-transform-object-rest-spread')]
       }
      }],
      "neutrino-preset-vue"
    ],
    ...
  };
```

[vuejs]: https://vuejs.org/v2/guide/components.html
[babel-object-rest-spread-plugin]: https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread
[npm-image]: https://img.shields.io/npm/v/neutrino-preset-vue.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-vue.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-vue
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
