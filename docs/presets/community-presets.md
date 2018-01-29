# Community Presets

A collection of Neutrino presets published on npm. In order to have your preset show up in this list, it must:

- Be published to npm
- Contain the `neutrino-preset` keyword in package.json
- Not be deprecated

In addition, your preset should also:

- Have a relevant description
- Use `neutrino` as a `peerDependency` to mark which versions of Neutrino your preset supports:

```json
{
  "peerDependencies": {
    "neutrino": "^8.0.0"
  }
}
```

It should also have a relevant description. If you prefer, you can also add your preset to the
[neutrino-dev wiki](https://github.com/mozilla-neutrino/neutrino-dev/wiki/Community-Presets).

{% npmsearchlist "q=keywords:neutrino-preset%20not:deprecated&size=250" %}{% endnpmsearchlist %}
