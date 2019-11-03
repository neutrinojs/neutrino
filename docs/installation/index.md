# Installing Neutrino

## Requirements

Installing Neutrino requires Node.js 10+, and either [Yarn](https://yarnpkg.com/en/docs/install) or
npm. At a minimum, you will be installing Neutrino and Neutrino middleware, such as `@neutrinojs/react`.

## Create New Project

The fastest way to get started is by using the [`@neutrinojs/create-project`](./create-new-project.md) scaffolding tool.
If you don’t want to use the CLI helper, proceed below for manual installation instructions.

## Yarn Installation

Run the following command inside your project directory. Substitute `MIDDLEWARE` with the name of the middleware
you wish to install.

```bash
yarn add --dev neutrino MIDDLEWARE
```

For example, if you wanted to build your project using Neutrino's React preset:

```bash
yarn add --dev neutrino @neutrinojs/react
```

## npm Installation

Run the following command inside your project directory. Substitute `MIDDLEWARE` with the name of the middleware
you wish to install.

```bash
npm install --save-dev neutrino MIDDLEWARE
```

For example, if you wanted to build your project using Neutrino's React preset:

```bash
npm install --save-dev neutrino @neutrinojs/react
```

## Getting started

Please continue through the documentation for instructions on Neutrino usage and default project layout.
