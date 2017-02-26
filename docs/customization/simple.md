# Simple Neutrino Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications
to the way your Neutrino preset is building your project. By defining a configuration object within your package.json,
Neutrino will merge this information with that provided by your preset, effectively overriding those options with your
custom data.

## Prepare package.json

First, you will need to define a `config` section within your package.json. You
[may have already done this](/usage.md#using-multiple-presets) if you
specified your presets through the `config` as opposed to flags through `scripts`:

```json
{
  "config": {
    "presets": [
      "neutrino-preset-react",
      "neutrino-preset-karma"
    ]
  },
  "scripts": {
    "start": "neutrino start",
    "build": "neutrino build"
  }
}
```

Add a new property to `config` named `neutrino`. This will be an object where we can provide configuration data:

```json
{
  "config": {
    "presets": [],
    "neutrino": {

    }
  }
}
```

Populate this object with configuration overrides. This is not a Webpack configuration, but rather a Neutrino-compatible
object based on [webpack-chain](https://github.com/mozilla-rpweb/webpack-chain).

## Usage

### Entries

Add files to named entry points, or define new entry points. This is a key named `entry`, with a value being an object.
This maps to points to enter the application. At this point the application starts executing.

_Example: Define an entry point named `vendor` that bundles React packages separately from the application code._

```json
{
  "config": {
    "neutrino": {
      "entry": {
        "vendor": [
          "react",
          "react-dom",
          "react-hot-loader",
          "react-router-dom"
        ]
      }
    }
  }
}
```

### Module

The `module` object defines how the different types of modules within a project will be treated. Any additional
properties attached to `module` not defined below will be set on the final module configuration.

#### Module Rules

Using `module.rule` creates rules that are matched to requests when modules are created. These rules can modify how the
module is created. They can apply loaders to the module, or modify the parser. 

Using `module.rule.loader` allows to you define the Webpack loader and its options for processing a particular rule.
This loader is usually a `dependency` or `devDependency` of your project. Each `loader` object can specify a property
for the string `loader` and an `options` object.

_Example: Add LESS loading to the project._

```json
{
  "dependencies": {
    "less": "^2.7.2",
    "less-loader": "^2.2.3"
  },
  "config": {
    "neutrino": {
      "module": {
        "rule": {
          "styles": {
            "test": "\\.less$",
            "loader": {
              "less": {
                "loader": "less-loader",
                "options": {
                  "noIeCompat": true
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Output

The `output` object contains a set of options instructing Webpack on how and where it should output your bundles,
assets, and anything else you bundle or load with Webpack. This option can be any property/value combination that
[Webpack accepts](https://webpack.js.org/configuration/output/).

_Example: Change the public path of the application._

```json
{
  "config": {
    "neutrino": {
      "output": {
        "publicPath": "https://cdn.example.com/assets/"
      }
    }
  }
}
```

### Node

Use `node` to customize the Node.js environment using polyfills or mocks:

_Example: mock the `__filename` and `__dirname` Node.js globals._

```json
{
  "config": {
    "neutrino": {
      "node": {
        "__filename": "mock",
        "__dirname": "mock"
      }
    }
  }
}
```

### DevServer

Use `devServer` to customize webpack-dev-server and change its behavior in various ways.

_Example: gzip the application when serving and listen on port 9000._

```json
{
  "config": {
    "neutrino": {
      "devServer": {
        "compress": true,
        "port": 9000
      }
    }
  }
}
```

### Resolve

Use `resolve` to change how modules are resolved. When using `resolve.extensions` and `resolve.modules`, these should be
specified as arrays, and will be merged with their respective definitions used in inherited presets. Any additional
properties attached to `resolve` not defined below will be set on the final module configuration.

_Example: Add `.mjs` as a resolving extension and specify modules are located in a `custom_modules` directory._

```json
{
  "config": {
    "neutrino": {
      "resolve": {
        "extensions": [".mjs"],
        "modules": ["custom_modules"]
      }
    }
  }
}
```

### ResolveLoader

Use `resolveLoader` to change how loader packages are resolved. When using `resolveLoader.extensions` and
`resolveLoader.modules`, these should be specified as arrays, and will be merged with their respective definitions used
in inherited presets. Any additional properties attached to `resolveLoader` not defined below will be set on the final
module configuration.

_Example: Add `.loader.js` as a loader extension and specify modules are located in a `web_loaders` directory._

```json
{
  "config": {
    "neutrino": {
      "resolve": {
        "extensions": [".loader.js"],
        "modules": ["web_loaders"]
      }
    }
  }
}
```

### Additional configuration

Any top-level properties you set on `config.neutrino` will be added to the configuration.

_Example: Change the Webpack performance options to error when exceeding performance budgets._

```json
{
  "config": {
    "neutrino": {
      "performance": {
        "hints": "error"
      }
    }
  }
}
```

## Advanced Configuration

With the options defined above in your package.json, you can perform a variety of build customizations on a per-project
basis. In the event that you need more customization than what is afforded through JSON, consider either switching to
[advanced configuration](/customization/advanced.md), or [creating your own preset](/creating-presets.md).
