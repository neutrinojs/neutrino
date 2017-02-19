# Developing Neutrino

Developing and contributing to Neutrino and its core presets is done through our monorepo located at
https://github.com/mozilla-neutrino/neutrino-dev. The code is broken up into a couple different sections:
packages and documentation.

_Note: In this guide, commands executable from the command line are prepended with `❯`. Lines not starting
with this symbol show sample console output from running the previous command._

## Requirements

Developing for neutrino-dev requires:

- Node.js v6.9+
- Yarn client, installation instructions at https://yarnpkg.com/en/docs/install
- git, GitHub account

## Getting started

The first step to start developing neutrino-dev is forking the repository to your own GitHub account.

<a href="https://github.com/mozilla-neutrino/neutrino-dev/fork" target="_blank">Fork mozilla-neutrino/neutrino-dev on GitHub</a>

Once that is done, you can clone your copy of the repository on your computer, replacing `USER` with the username
of the account you forked the repository to:

```bash
❯ git clone git@github.com:USER/neutrino-dev.git
❯ cd neutrino-dev
```

Upon cloning, you should install dependencies and bootstrap the project:

```bash
❯ yarn
❯ yarn bootstrap
```

This will create symlinks between the various packages, making local development much easier. It also creates yarn links
for testing out these packages elsewhere on your system.

## Development commands

The package.json for neutrino-dev defines several commands to assist in the development and deployment process.

---

`bootstrap`

Installs all sub-package dependencies using yarn. External dependencies are installed normally, whereas those belonging
to the neutrino-dev monorepo itself are `yarn link`ed.

```bash
❯ yarn bootstrap
```

---

`changelog`

Generates a changelog for the `mozilla-neutrino/neutrino-dev` GitHub repository. This changelog is output to a
`CHANGELOG.md` file in the root of the repository.

```bash
❯ yarn changelog
```

---

`deps:add [--dev] <package> <...dependencies>`

Adds one or more new dependencies or development dependencies to a sub-package. Any flags used, such as `--dev` are
passed on to `yarn add`. For example, if you wanted to add "lodash.clonedeep" to the neutrino package:

```bash
❯ yarn deps:add neutrino lodash.clonedeep
```

---

`deps:remove <package> <...dependencies>`

Removes one or more dependencies from a sub-package. Any flags used are
passed on to `yarn remove`. For example, if you wanted to remove "lodash.clonedeep" from the neutrino package:

```bash
❯ yarn deps:remove neutrino lodash.clonedeep
```

---

`deps:upgrade <package> <...dependencies>`

Upgrades one or more dependencies in a sub-package. Any flags used are
passed on to `yarn upgrade`. For example, if you wanted to upgrade "lodash.clonedeep" in the neutrino package:

```bash
❯ yarn deps:upgrade neutrino lodash.clonedeep
```

---

`deps:clean`

Removes the `node_modules` directory from all sub-packages. After running this you will need to re-bootstrap
neutrino-dev in order to continue development. Useful if you have somehow put your local development environment in an
unworkable state with regards to local inter-dependencies.

```bash
❯ yarn deps:clean
```

---

`docs:serve`

Starts a local development server which builds the documentation in `docs` to a gitbook running on port 4000.

```bash
❯ yarn docs:serve
```

---

`docs:build`

Generates a static site by building the documentation in `docs` to a gitbook to the `_book` directory.

```bash
❯ yarn docs:build
```

---

`docs:deploy`

Generates a static site by building the documentation in `docs` to a gitbook to the `_book` directory, then pushing the
contents of `_book` to a `gh-pages` branch on GitHub. In order to run this command, you must have an `upstream` remote
configured pointing to the root neutrino-dev repo, and have sufficient rights to push to the repository.

```bash
❯ yarn docs:deploy
```

## Making changes

When you make changes to neutrino-dev, you should make them in a branch separate from `master`. Start from the
master branch and create a new branch for your changes.

_Example: You want to create a core preset for JavaScript Standard Style. You need a new branch for this work._

```bash
❯ git checkout -b standard-style
Switched to a new branch 'standard-style'
```

While making changes, be sure to test your code out for expected operation. If possible or applicable, write a
test that can verify these changes in the future.

## Submitting a pull request

Once you are satisified with your changes, you should commit them and submit a pull request. Use `git add`
in order to add files that should be committed. Give your changes a descriptive but not overly verbose message.

```bash
❯ git add .
❯ git commit -m "Feature: Adding new core preset for JavaScript Standard Style"
❯ git push origin standard-style
```

Now if you open the GitHub page for your repository, GitHub should display a button to open a pull request for
the branch and commit you just pushed. When filling out the details of the pull request, try to be as descriptive
as possible, following our detailed [contribution guidelines](/contributing/README.md).

### Congrats!

You just made a contribution to Neutrino! We are so happy to have your help! 🎉

## Receiving updates

If you need to update your local copy of neutrino-dev to be in sync with the main neutrino-dev repository, you
will want to fetch upstream changes. Add the main neutrino-dev repo as an upstream to your local copy, then fetch
the latest changes from the master branch.

```bash
❯ git checkout master
❯ git remote add upstream https://github.com/mozilla-neutrino/neutrino-dev.git
❯ git pull upstream master
```
