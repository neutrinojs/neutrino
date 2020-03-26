# Migrate a Neutrino Project

`@neutrinojs/migrate` can assist with some of the changes needed to migrate to
Neutrino 9.

## Getting Started

The `npx @neutrinojs/migrate` command starts the process. Let's take a look at
the help output of migrate:

```bash
❯ npx @neutrinojs/migrate --help

migrate [files..]

Migrate Neutrino middleware to the latest version via codemods

Positionals:
  files  files to migrate  [default: [".neutrinorc.js"]]

Options:
  --version     Show version number  [boolean]
  --dry, -d     dry run (no changes are made to files)  [boolean]
  --print, -p   print transformed files to stdout, useful for development  [boolean]
  --silent, -s  do not write to stdout or stderr  [boolean]
  --help        Show help  [boolean]
```

## Middleware migration

To convert legacy string and array-based middleware usage in Neutrino middleware
files to function calls:

```bash
❯ npx @neutrinojs/migrate
```

This will make transformations in `.neutrinorc.js` by default. You can manually
specify middleware files to transform by passing them as arguments on the
command line:

```bash
❯ npx @neutrinojs/migrate .neutrinorc.js
❯ npx @neutrinojs/migrate index.js
❯ npx @neutrinojs/migrate src/index.js src/other.js .neutrinorc.js
```

This will make the following transformations:

- Convert string middleware usage in `module.exports.use[]` to function calls:

```js
// Before:
module.exports = {
  use: ['@neutrinojs/react'],
};

// After:
const react = require('@neutrinojs/react');

module.exports = {
  use: [react()],
};
```

- Convert array middleware usage in `module.exports.use[]` to function calls,
  respecting the options by passing them as arguments to the function call:

```js
// Before:
module.exports = {
  use: [
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Migration App',
        },
      },
    ],
  ],
};

// After:
const react = require('@neutrinojs/react');

module.exports = {
  use: [
    react({
      html: {
        title: 'Migration App',
      },
    }),
  ],
};
```

- Convert string middleware usage in `neutrino.use()` to function calls,
  respecting any additional arguments by passing them to the new function call:

```js
// Before:
module.exports = (neutrino) => {
  neutrino.use('@neutrinojs/react');
};

// After:
const react = require('@neutrinojs/react');

module.exports = (neutrino) => {
  neutrino.use(react());
};
```

```js
// Before:
module.exports = (neutrino) => {
  neutrino.use('@neutrinojs/react', {
    html: {
      title: 'Migration App',
    },
  });
};

// After:
const react = require('@neutrinojs/react');

module.exports = (neutrino) => {
  neutrino.use(
    react({
      html: {
        title: 'Migration App',
      },
    }),
  );
};
```

## Contributing

This project is part of the [neutrino](https://github.com/neutrinojs/neutrino)
repository, a monorepo containing all resources for developing Neutrino and its
core presets and middleware. Follow the
[contributing guide](https://neutrinojs.org/contributing/) for details.

[npm-image]: https://img.shields.io/npm/v/@neutrinojs/migrate.svg
[npm-downloads]: https://img.shields.io/npm/dt/@neutrinojs/migrate.svg
[npm-url]: https://www.npmjs.com/package/@neutrinojs/migrate
