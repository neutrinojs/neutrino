# Neutrino React Components Preset

`@neutrinojs/react-components` is a Neutrino preset for building sets of React components.

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Join the Neutrino community on Spectrum][spectrum-image]][spectrum-url]

`@neutrinojs/react-components` is a Neutrino preset that supports creating generic React components and previewing
them without the need to embed in an application. Plays nicely with other Neutrino middleware, so you can build, test,
preview, and publish multiple React components from a single repository.

## Features

- Extends partially from [@neutrinojs/react](../react)
- Zero upfront configuration necessary to start developing, building, and visually previewing a React component.
Minimal code is needed to generate stories previewer.
- Modern Babel compilation adding JSX and object rest spread syntax.
- Support for React Hot Loader
- Write JSX in .js or .jsx files
- Support for importing web workers with `.worker.js` file extensions
- Extends from [@neutrinojs/web](../web)
  - Modern Babel compilation supporting ES modules, **latest** major browser versions, async functions, and dynamic imports
  - webpack loaders for importing HTML, CSS, images, icons, fonts, and web workers
  - webpack Dev Server during development
  - Hot module replacement support
  - Easily extensible to customize your project as needed

**Important! This preset does not include babel-polyfill for size reasons. If you need
polyfills in your library code, consider importing babel-polyfill, core-js, or other alternative.**

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7
- React, React DOM, and React Addons CSS Transition Group

## Installation

`@neutrinojs/react-components` can be installed via the Yarn or npm clients. Inside your project, make sure
`neutrino` and `@neutrinojs/react-components` are development dependencies. You will also need React and React DOM
for actual component development.

#### Yarn

```bash
❯ yarn add --dev neutrino @neutrinojs/react-components
❯ yarn add react react-dom react-addons-css-transition-group
```

#### npm

```bash
❯ npm install --save-dev neutrino @neutrinojs/react-components
❯ npm install --save react react-dom react-addons-css-transition-group
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

`@neutrinojs/react-components` follows the standard [project layout](../../project-layout)
specified by Neutrino. This means that by default all project source code should live in a directory named `src` in the
root of the project. This includes JavaScript files that would be available to your compiled project.

All components should be their own module within a directory named `components` inside the source directory.

## Quickstart

After installing Neutrino and this preset, add a new directory named `src` in the root of the project, with
a single JS file named `stories.js` in it.

```bash
❯ mkdir src && touch src/stories.js
```

Edit your `src/stories.js` file with the following:

```js
import React from 'react';
import { render } from 'react-dom';
import { Stories, Story, Props } from '@neutrinojs/react-components/lib';
import YourCustomComponent from './components/YourCustomComponent';

const root = document.getElementById('root');

render((
  <Stories>
    <Story component={YourCustomComponent}>
      <Props name="Default" />
      <Props name="State A" someProp="alpha" />
      <Props name="State B w/ children">Child!</Props>
    </Story>
  </Stories>
), root);
```

Now edit your project's package.json to add commands for starting the preview app, or building the components.

```json
{
  "scripts": {
    "start": "neutrino start --use @neutrinojs/react-components",
    "build": "neutrino build --use @neutrinojs/react-components"
  }
}
```

If you are using `.neutrinorc.js`, add this preset to your use array instead of `--use` flags:

```js
module.exports = {
  use: ['@neutrinojs/react-components']
};
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

`@neutrinojs/react-components` builds components to the `lib` directory by default when running `neutrino build`.
Using the quick start example above as a reference:

```bash
❯ yarn build

✔ Building project completed
Hash: 453804a130a959d313a1
Version: webpack 2.6.1
Time: 350ms
                     Asset     Size  Chunks             Chunk Names
    YourCustomComponent.js  4.12 kB       0  [emitted]  YourCustomComponent
YourCustomComponent.js.map  4.11 kB       0  [emitted]  YourCustomComponent
✨  Done in 3.69s.
```

You can then publish these components to npm. When publishing your project to npm, consider excluding your `src`
directory by using the `files` property to whitelist `lib`, or via `.npmignore` to blacklist `src`. Components are
generated as UMD named modules, with the name corresponding to the component file name. e.g.
`src/components/Custom/index.js` maps to `Custom`, as well as `src/components/Custom.js` mapping to `Custom`.

These modules are ES-compatible modules, so they can be `import`ed as expected. If you want to use them with CJS
`require`, you'll need to use the `.default` property to access the default exports:

```js
const YourCustomComponent = require('your-custom-component').default;
```

By default this preset creates an individual entry point for every top-level component found in `src/components`. These
are set and accessible via the API at [`neutrino.options.mains`](../../api#optionsmains).

## Previewer Components

This preset exposes 3 React components from `@neutrinojs/react-components/lib` to generate a component previewer
interface:

### Stories

The `<Stories />` component is the container for how a series of components should be rendered. It is responsible
for rendering the navigation menu, switching between components and component states, and rendering the selected
component.

The `<Stories />` component should be given 1 or more `<Story />` components as children.

```js
import React from 'react';
import { render } from 'react-dom';
import { Stories } from '@neutrinojs/react-components/lib';

const root = document.getElementById('root');

render((
  <Stories>
    ...
  </Stories>
), root);
```

### Story

The `<Story />` component defines how a particular component is previewed. It accepts a `component` property which
is the component to preview.

The `<Story />` component should be given 1 or more `<Props />` components as children which will be used to
render the specified component upon selection.

```js
import React from 'react';
import { render } from 'react-dom';
import { Stories, Story } from '@neutrinojs/react-components/lib';

const root = document.getElementById('root');

class Example extends React.Component {}

render((
  <Stories>
    <Story component={Example}>
      ...
    </Story>
  </Stories>
), root);
```

### Props

The `<Props />` component defines what props are passed to the `<Story />`'s component when this story is
selected. All props and children passed to this `Props` will be passed as props to the component.

The `<Props />` component should be given a `name` property for displaying in the `Stories` UI.

```js
import React from 'react';
import { render } from 'react-dom';
import { Stories, Story, Props } from '@neutrinojs/react-components/lib';

const root = document.getElementById('root');

class Example extends React.Component {
  render() {
    return <h1>Hello {this.props.message || 'world'}</h1>;
  }
}

render((
  <Stories>
    <Story component={Example}>
      <Props name="Default" />
      <Props name="With 'Internet'" message="Internet" />
      <Props name="With emphasis" message="WORLD!!!" />
    </Story>
  </Stories>
), root);
```

![example gif](example.gif)

## Hot Module Replacement

While `@neutrinojs/react-components` supports Hot Module Replacement for your app, it does require some
changes to the preview app in order to operate. The preview app should define split points for which to accept
modules (Components) to reload using `module.hot`. See the
[React preset docs](../react/#hot-module-replacement) for guidance.

## Customizing

To override the build configuration, start with the documentation on [customization](../../customization).
`@neutrinojs/react-components` uses a few rules and plugins in addition to the ones in use by the React and Web presets.
See the [Web documentation customization](../web#customizing)
for preset-specific configuration to override.

By default this preset creates an individual entry point for every top-level component found in `src/components`. These
are set and accessible via the API at [`neutrino.options.mains`](../../api#optionsmains).

### Rules

The following is a list of rules and their identifiers which can be overridden, in addition to the ones from the Web preset:

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `style` | Allows importing CSS stylesheets. Contains two loaders named `style` and `css`. | all |
| `css-modules` | Allows importing modules from project CSS stylesheets named `*.module.css`. Contains two loaders named `style` and `css`. | all |

### Plugins

The following is a list of plugins and their identifiers which can be overridden (in addition to the plugins used
by the React/Web presets):

_Note: Some plugins are only available in certain environments. To override them, they should be modified conditionally._

| Name | Description | Environments |
| ---- | ----------- | ------------ |
| `banner` | Injects source-map-support into the entry point of your application if detected in `dependencies` or `devDependencies` of your package.json. | all but `development` |

By following the [customization guide](../../customization) and knowing the rule, loader, and plugin IDs above,
you can override and augment the build by by providing a function to your `.neutrinorc.js` use array. You can also
make these changes from the Neutrino API in custom middleware.

_Example: Change the name of the components directory:_

```js
module.exports = {
  use: [
    ['@neutrinojs/react-components', {
      components: 'react-stuff' // now you can put your components in src/react-stuff/
    }]
  ]
}
```

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/react-components.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/react-components.svg
[npm-url]: https://npmjs.org/package/@neutrinojs/react-components
[spectrum-image]: https://withspectrum.github.io/badge/badge.svg
[spectrum-url]: https://spectrum.chat/neutrino
