# Developing Neutrino

Developing and contributing to Neutrino, its core presets, and middleware is done through our monorepo located at
https://github.com/neutrinojs/neutrino. The code is broken up into a couple different sections:
packages and documentation.

_Note: In this guide, commands executable from the command line are prepended with `❯`. Lines not starting
with this symbol show sample console output from running the previous command._

## Requirements

Developing for neutrino requires:

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, installation instructions at https://yarnpkg.com/en/docs/install
- git, GitHub account

## Getting started

The first step to start developing neutrino is
[forking the repository to your own GitHub account](https://help.github.com/articles/fork-a-repo/).

<a href="https://github.com/neutrinojs/neutrino/fork" target="_blank">Fork neutrinojs/neutrino on GitHub</a>

Once that is done, you can clone your copy of the repository on your computer, replacing `USER` with the username
of the account you forked the repository to:

```bash
❯ git clone git@github.com:USER/neutrino.git
❯ cd neutrino
```

Upon cloning, you should install dependencies:

```bash
❯ yarn
```

This uses the yarn workspaces feature to create symlinks between the various packages, simplifying local development.

## Development commands

The package.json for neutrino defines several commands to assist in the development and deployment process.

---

`link:all`

Runs `yarn link` against all packages in the neutrino monorepo. This allows you to run `yarn link <package>`
anywhere on your system for neutrino packages, making testing of the packages simpler in local projects.

```bash
❯ yarn link:all

# Elsewhere on your system
❯ yarn link @neutrinojs/react
```

---

`changelog`

Generates a changelog for the `neutrinojs/neutrino` GitHub repository. This changelog is output to a
`CHANGELOG.md` file in the root of the repository.

```bash
❯ yarn changelog
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

## Making changes

When you make changes to neutrino, you should make them in a branch separate from `master`. Start from the
master branch and create a new branch for your changes.

_Example: You want to create a core preset for JavaScript Standard Style. You need a new branch for this work._

```bash
❯ git checkout -b standard-style
Switched to a new branch 'standard-style'
```

While making changes, be sure to test your code out for expected operation. If possible or applicable, write a
test that can verify these changes in the future.

## Submitting a pull request

Once you are satisfied with your changes, you should commit them and submit a pull request. Use `git add`
in order to add files that should be committed. Give your changes a descriptive but not overly verbose message.

```bash
❯ git add .
❯ git commit -m "Feature: Adding new core preset for JavaScript Standard Style"
❯ git push origin standard-style
```

Now if you open the GitHub page for your repository, GitHub should display a button to open a pull request for
the branch and commit you just pushed. When filling out the details of the pull request, try to be as descriptive
as possible, following our detailed [contribution guidelines](./README.md).

### Congrats!

You just made a contribution to Neutrino! We are so happy to have your help! 🎉

## Receiving updates

If you need to update your local copy of neutrino to be in sync with the main neutrino repository, you
will want to fetch upstream changes. Add the main neutrino repo as an upstream to your local copy, then fetch
the latest changes from the master branch.

```bash
❯ git checkout master
❯ git remote add upstream https://github.com/neutrinojs/neutrino.git
❯ git pull upstream master
```
