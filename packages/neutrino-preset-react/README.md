# Neutrino React Preset

This [neutrino](https://github.com/mozilla-neutrino/neutrino) preset enables building JSX-supported
React-based web applications with a common configuration for Webpack, ESLint, Babel, Karma+Mocha,
along with a static local development server.

<sup>This preset extends the [neutrino-preset-web preset](https://github.com/mozilla-neutrino/neutrino-preset-web) by enhancing it with React-specific configuration.</sup>

# Getting started

Install neutrino and neutrino-preset-react as development dependencies in your project:

```sh
# npm
npm install --save-dev neutrino neutrino-preset-react

# yarn
yarn add neutrino neutrino-preset-react --dev
```

Modify your package.json scripts to use the React preset to build your project

```json
{
  "config": {
    "preset": "neutrino-preset-react"
  },
  "scripts": {
    "start": "PORT=4000 neutrino start",
    "build": "neutrino build",
    "test": "neutrino test"
  }
}
```

Add your source code to `src/`, which is compiled using Babel's es2015, react, and stage-0 presets.
A number of loaders are pre-configured, allowing you to use `import` and `export` for CSS, images,
HTML, and JSON. During development, run `npm start` or `yarn start` to start a local development server for running
the application. When you are ready to build your project into static assets, run `npm run build` or `yarn run build`
which will create a `build/` directory in the root of your project.

If you would like to use testing in your project, create a `test/` directory, and write tests in
JS files with file names ending in `_test.js`, e.g. `test/homepage_test.js` or
`test/users/admin_test.js`. Run tests with `npm test` or `yarn test`, which will output results to the console, and
also creates test coverage to a `.coverage/` directory.

# Overriding the preset

There may be times where this preset works well for you, but you need to change some of the defaults
it provides. Maybe you don't like the opinion of the ESLint rules, or want to add more types of file
loading. Whatever the reason for needing changes, you can either create a custom preset based on
this one, or change the values on a project-by-project basis.

To override in your project, create a new file to use as a preset which will modify the existing
one, e.g. `custom-preset.js`:

```js
// bring in the existing preset
const preset = require('neutrino-preset-react');

// modify the preset

// re-export the preset
module.exports = preset;
```

Now you can pass this file to neutrino to use as the new preset:

```json
{
  "config": {
    "preset": "custom-preset.js"
  }
}
```

You can also choose to load different presets for different targets if you so wish:

```json
{
  "config": {
    "preset": "custom-preset.js"
  },
  "scripts": {
    "start": "neutrino start",
    "test": "neutrino test --preset some-other-preset",
    "build": "neutrino build --preset neutrino-preset-react"
  }
}
```

# Overriding the default page template

By default, HTML files are built using the `template.ejs` from the [neutrino-preset-web preset](https://github.com/mozilla-neutrino/neutrino-preset-web).
If you wish to use a custom template or if the default just doesn't suit your needs, you can create
a `template.ejs` file in your `src/` directory, and it will be picked up automatically.
