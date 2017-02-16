# Installing Neutrino

## Requirements

Installing Neutrino requires Node.js v6+, and either [Yarn](https://yarnpkg.com/lang/en/docs/install/) or
npm. At a minimum you will be installing Neutrino and a Neutrino preset, such as `neutrino-preset-react`.

## Yarn Installation

Run the following command inside your project directory. Substitute `PRESET_PKG` with the name of the preset
you wish to install.

```bash
yarn add --dev neutrino PRESET_PKG
```

For example, if you wanted to build your project using Neutrino's React preset:

```bash
yarn add --dev neutrino neutrino-preset-react
```

## npm Installation

Run the following command inside your project directory. Substitute `PRESET_PKG` with the name of the preset
you wish to install.

```bash
npm install --save-dev neutrino PRESET_PKG
```

For example, if you wanted to build your project using Neutrino's React preset:

```bash
npm install --save-dev neutrino neutrino-preset-react
```

## Getting started

Please continue through the documentation for instructions on Neutrino usage and default project layout.
