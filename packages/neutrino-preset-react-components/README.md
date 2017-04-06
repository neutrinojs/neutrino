# Neutrino React Components Preset
[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Join Slack][slack-image]][slack-url]

`neutrino-preset-react-components` is a Neutrino preset that supports creating generic React components and previewing them
without the need to embed in an application. Plays nicely with other Neutrino middleware, so you can build, test, preview,
and publish multiple React components from a single repository.

## Features

- Zero upfront configuration necessary to start developing and building React components, only setup
is a little boilerplate to generate the previewer application.
- Modern Babel compilation supporting ES modules, Node.js 6.9+, async functions, and dynamic imports, and React with JSX
- Extends from neutrino-preset-node
  - Supports automatically-wired sourcemaps
  - Tree-shaking to create smaller bundles
  - Hot Module Replacement with source-watching during development
  - Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client
- Neutrino v5

## Installation

`neutrino-preset-react-components` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `neutrino-preset-react-components` are development dependencies. You will also need React and ReactDOM
for actual component development.

#### Yarn

```bash
❯ yarn add --dev neutrino neutrino-preset-react-components
❯ yarn add react react-dom
```

#### npm

```bash
❯ npm install --save-dev neutrino neutrino-preset-react-components
❯ npm install --save react react-dom
```

If you want to have automatically wired sourcemaps added to your project, add `source-map-support`:

#### Yarn

```bash
❯ yarn add source-map-support
```

#### npm

```bash
❯ npm install --save source-map-support
```

## Project Layout

`neutrino-preset-react-components` follows the standard [project layout](https://neutrino.js.org/project-layout) specified by Neutrino. This
means that by default all project source code should live in a directory named `src` in the root of the
project. This includes JavaScript files that would be available to your compiled project.

All components should be their own module within a directory named `components` inside the source directory.

## Quickstart

After installing Neutrino and this preset, add a new directory named `src` in the root of the project, with
a single JS file named `app.js` in it.

```bash
❯ mkdir src && touch src/app.js
```

Edit your `src/app.js` file with the following:

```js
import React from 'react';
import { render } from 'react-dom';
import { Previewer, Preview, PreviewState } from 'neutrino-preset-react-component/lib/ui';
import YourCustomComponent from './components/YourCustomComponent';

const root = document.getElementById('root');

render((
  <AppContainer>
    <Previewer>
      <Preview component={YourCustomComponent}>
        <PreviewState name="Default" />
        <PreviewState name="State 1" someProp="alpha" />
        <PreviewState name="State 2" otherProp="beta" />
      </Preview>
    </Previewer>
  </AppContainer>
), root);
```

Now edit your project's package.json to add commands for starting and building the application.

```json
{
  "scripts": {
    "start": "neutrino start --use neutrino-preset-react-components",
    "build": "neutrino build --use neutrino-preset-react-components"
  }
}
```

Start the app, then open a browser to http://localhost:5000 to preview your components:

#### Yarn

```bash
❯ yarn start
✔ Development server running on: http://localhost:5000
✔ Build completed
```

#### npm

```bash
❯ npm start
✔ Development server running on: http://localhost:5000
✔ Build completed
```

## Building

`neutrino-preset-react-components` builds components to the `lib` directory by default when running `neutrino build`. Using the
quick start example above as a reference:

```bash
❯ yarn build

✔ Building project completed
Hash: 453804a130a959d313a1
Version: webpack 2.3.3
Time: 350ms
                     Asset     Size  Chunks             Chunk Names
    YourCustomComponent.js  4.12 kB       0  [emitted]  YourCustomComponent
YourCustomComponent.js.map  4.11 kB       0  [emitted]  YourCustomComponent
✨  Done in 3.69s.
```

You can then publish these components to npm. When publishing your
project to npm, consider excluding your `src` directory by using the `files` property to whitelist `build`,
or via `.npmignore` to blacklist `src`. These are generated as UMD named modules, with the name corresponding to the
component file name. e.g. `src/components/Custom/index.js` maps to `Custom`, and `src/components/Custom.js` maps to `Custom`.

These modules are ES-compatible modules, so they can be `import`ed as expected. If you want to use them with CJS `require`, you'll
need to use the `.default` property to access the default exports:

```js
const YourCustomComponent = require('your-custom-component').default;
```

## Previewer Components

This preset exposes 3 React components from `neutrino-preset-react-component/lib/ui` to generate a component previewer
interface:

### Previewer

The `<Previewer />` component is the container for how a series of components should be rendered. It is responsible
for rendering the navigation menu, switching between components and component states, and rendering the component
into its own iframe.

The `<Previewer />` component should be given 1 or more `<Preview />` components as children.

```js
import React from 'react';
import { render } from 'react-dom';
import { Previewer } from 'neutrino-preset-react-component/lib/ui';

const root = document.getElementById('root');

render((
  <Previewer>
    ...
  </Previewer>
), root);
```

### Preview

The `<Preview />` component defines how a particular component is previewed. It accepts a `component` property which
is the component to preview.

The `<Preview />` component should be given 1 or more `<PreviewState />` components as children which will be used to
render the specified component upon selection.

```js
import React from 'react';
import { render } from 'react-dom';
import { Previewer, Preview } from 'neutrino-preset-react-component/lib/ui';

const root = document.getElementById('root');

class Example extends React.Component {}

render((
  <Previewer>
    <Preview component={Example}>
      ...
    </Preview>
  </Previewer>
), root);
```

### PreviewState

The `<PreviewState />` component defines what props are passed to the `<Preview />`'s component when this state is
selected. All props and children passed to this `PreviewState` will be passed as props to the component.

The `<Preview />` component should be given a `name` property for displaying in the `Previewer` UI.

```js
import React from 'react';
import { render } from 'react-dom';
import { Previewer, Preview, PreviewState } from 'neutrino-preset-react-component/lib/ui';

const root = document.getElementById('root');

class Example extends React.Component {
  render() {
    return <h1>Hello {this.props.message || 'world'}</h1>;
  }
}

render((
  <Previewer>
    <Preview component={Example}>
      <PreviewState name="Default" />
      <PreviewState name="With 'Internet'" message="Internet" />
      <PreviewState name="With emphasis" message="WORLD!!!" />
    </Preview>
  </Previewer>
), root);
```

![example gif](neutrino-react-components-example.gif)

## Hot Module Replacement

While `neutrino-preset-react-components` supports Hot Module Replacement for your app, it does require some application-specific
changes in order to operate. Your application should define split points for which to accept modules to reload using
`module.hot`. See the [React preset docs](https://neutrino.js.org/presets/neutrino-preset-react/#hot-module-replacement) for an example.

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization).
`neutrino-preset-react-components` creates some conventions to make overriding the configuration easier once you are ready to make
changes.

By default the Node.js preset creates an individual entry point for every component found in `src/components`.

### Rules

The following is a list of rules and their identifiers which can be overridden:

- `compile`: Compiles JS files from the `src` directory using Babel. Contains a single loader named `babel`.
- `style`: Allows importing CSS stylesheets from modules. Contains two loaders named `style` and `css`.

### Plugins

The following is a list of plugins and their identifiers which can be overridden:

- `banner`: Injects source-map-support into the entry point of your application if detected in `dependencies` or
`devDependencies` of your package.json.
- `copy`: Copies non-JS files from `src` to `build` when using `neutrino build`.
- `clean`: Clears the contents of `build` prior to creating a production bundle.

### Simple customization

By following the [customization guide](https://neutrino.js.org/customization/simple) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build directly from package.json.

#### Compile targets

This preset uses babel-preset-env to compile code targeting the Node.js v6.9+. To change
the Node.js target from package.json, specify an object at `neutrino.options.compile.targets` which contains a
[babel-preset-env-compatible](https://github.com/babel/babel-preset-env#targetsnode) Node.js target.

_Example: Replace the preset Node.js target with support for Node.js 4.2:_

```json
{
  "neutrino": {
    "options": {
      "compile": {
        "targets": {
          "node": 4.2
        }
      }
    }
  }
}
```

_Example: Change support to current Node.js version:_

```json
{
  "neutrino": {
    "options": {
      "compile": {
        "targets": {
          "node": "current"
        }
      }
    }
  }
}
```

#### Other customization examples

_Example: Allow importing modules with an `.mjs` extension._

```json
{
  "neutrino": {
    "config": {
      "resolve": {
        "extensions": [
          ".mjs"
        ]
      }
    }
  }
}
```

### Advanced configuration

By following the [customization guide](https://neutrino.js.org/customization/advanced) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by creating a JS module which overrides the config.

#### Compile targets

This preset uses babel-preset-env to compile code targeting the Node.js v6.9+. To change
the Node.js target from package.json, specify an object at `neutrino.options.compile.targets` which contains a
[babel-preset-env-compatible](https://github.com/babel/babel-preset-env#targetsnode) Node.js target.

**Note: Setting these options via `neutrino.options.compile` must be done prior to loading the preset or they
will not be picked up by the compile middleware. These examples show changing compile targets with options before
loading the preset and overriding them if loaded afterwards.**

_Example: Replace the preset Node.js target with support for Node.js 4.2:_

```js
module.exports = neutrino => {
  // Using neutrino.options prior to loading this preset
  neutrino.options.compile = {
    targets: {
      node: 4.2
    }
  };

  // Using compile options override following loading this preset
  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(options => {
      options.presets[0][1].targets.node = 4.2;

      return options;
    });
};
```

_Example: Change support to current Node.js version:_

```js
module.exports = neutrino => {
  // Using neutrino.options prior to loading this preset
  neutrino.options.compile = {
    targets: {
      node: 4.2
    }
  };

  // Using compile options override following loading this preset
  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(options => {
      options.presets[0][1].targets.node = 'current';

      return options;
    });
};
```

#### Other customization examples

_Example: Allow importing modules with an `.mjs` extension._

```js
module.exports = neutrino => {
  neutrino.config.resolve.extensions.add('.mjs');
};
```

[npm-image]: https://img.shields.io/npm/v/neutrino-preset-react-components.svg
[npm-downloads]: https://img.shields.io/npm/dt/neutrino-preset-react-components.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-react-components
[slack-image]: https://neutrino-slack.herokuapp.com/badge.svg
[slack-url]: https://neutrino-slack.herokuapp.com/
