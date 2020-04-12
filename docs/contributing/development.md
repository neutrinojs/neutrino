# Developing Neutrino

Developing and contributing to Neutrino, its core presets, and middleware is done through our monorepo located at
https://github.com/neutrinojs/neutrino. The code is broken up into a couple different sections:
packages and documentation.

_Note: In this guide, commands executable from the command line are prepended with `❯`. Lines not starting
with this symbol show sample console output from running the previous command._

## Requirements

Developing for neutrino requires:

- Node.js 10+
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

`test`

Runs the unit test suite against all packages in the monorepo. For the most part
the intent of the unit tests is to ensure that packages do not throw errors
when being required or used as middleware by Neutrino. These tests typically
do not ensure that their middleware produces the expected output, instead
leaving this functionality for integration tests via `test:create-project`.

---

`test:create-project`

Runs the integration test suite by determining correct output of the
`create-project` CLI tool and ensuring that package.json scripts do not throw.
This test requires a local [verdaccio](https://www.verdaccio.org/) instance
to be running, and this is ensured in CI via the
`scripts/test-create-project-ci.sh` script. Typically this command is only used
in CI, with the unit tests being run locally via `yarn test`. If you do run
this command locally by setting up verdaccio locally as well, ensure that
you revert back any changes you make to your local registry when finished with:

```bash
yarn config set registry https://registry.yarnpkg.com
``` 

---

`changelog`

Generates a changelog for the `neutrinojs/neutrino` GitHub repository. This changelog is output to a
`CHANGELOG.md` file in the root of the repository.

```bash
❯ yarn changelog
```

---

`docs:bootstrap`

Installs the Python dependencies required to build the documentation. You may wish to active a virtualenv first.

```bash
❯ yarn docs:bootstrap
```

---

`docs:serve`

Starts a local development server which builds the documentation in `docs` and serves it on port 8000.

```bash
❯ yarn docs:serve
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
as possible, following our detailed [contribution guidelines](./index.md).

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

## Releasing a new version

1. Decide whether the new version should be a major/minor/patch/prerelease version bump.
2. From the root of the Neutrino repository, run:

    `git fetch upstream --quiet && git checkout --no-track -B version-bump upstream/master`

3. Then run `yarn release:prepare` and pick the desired new version.
4. Check the changes in the working directory and adjust if necessary.

    If bumping to a new major version, or incrementing the pre-release version,
    you will want to manually increase the presets' version of `neutrino` in
    `peerDependencies`. For example by running:

    `sed -i 's/"neutrino": "^9.0.0"/"neutrino": "^10.0.0"/g' packages/*/package.json`

    On OS X, you will need to add an additional set of quotes after the `-i`, e.g.:

    `sed -i '' 's/"neutrino": "^9.0.0"/"neutrino": "^10.0.0"/g' packages/*/package.json`

    For Neutrino pre-releases you will likely want to remove the caret and pin
    to an exact version, since breaking changes can occur with each release.

    `sed -i 's/"neutrino": "^9.0.0"/"neutrino": "9.0.0-rc.1"/g' packages/*/package.json`

    `sed -i 's/"neutrino": "9.0.0-rc.1"/"neutrino": "9.0.0-rc.2"/g' packages/*/package.json`

5. Commit the changes using: `yarn release:commit`

    Your editor will open, where a multi-line commit message can be entered if you would
    like the release to have a summary in the changelog above the list of commits. If a
    summary is provided, the changelog will then need to be re-generated after the commit
    (using `yarn changelog:unreleased`) and then the commit amended to include the changes.

6. Open a Pull Request and request review.
7. Once the Pull request is merged, check out `master` at that revision.

    (It's important to not publish from the PR's branch, since with squash and
    merge the resultant package revision SHA will be different.)

8. Git tag and push the new tag: `yarn release:tag`
9. Double check the tagged commit (and its changelog) looks as expected on GitHub
   (it's a lot easier to fix at this stage than after publishing ).
10. Publish to NPM: `yarn release:publish` (or for a pre-release, `yarn release:publish-next`)
