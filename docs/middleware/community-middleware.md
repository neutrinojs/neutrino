# Community Middleware

A collection of Neutrino middleware published on npm. In order to have your middleware show up in this list, it must:

- Be published to npm
- Contain the `neutrino-middleware` keyword in package.json
- Not be deprecated

In addition, your middleware should also:

- Have a relevant description
- Use `neutrino` as a `peerDependency` to mark which versions of Neutrino your middleware supports:

```json
{
  "peerDependencies": {
    "neutrino": "^6.0.0"
  }
}
```

It should also have a relevant description. If you prefer, you can also add your middleware to the
[neutrino-dev wiki](https://github.com/mozilla-neutrino/neutrino-dev/wiki/Community-Middleware).

{% npmsearchlist "keywords:neutrino-middleware+not:deprecated" %}{% endnpmsearchlist %}
