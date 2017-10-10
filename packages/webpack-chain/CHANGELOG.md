2017-10-09
==========

  * Hotfix - guard against non-defined entries when ordering chainedmap

2017-10-05
==========

  * Updating changelog
  * 4.4.1
  * Missing schema before/after
  * 4.4.0
  * Bumping deps
  * Merge pull request [#42](https://github.com/mozilla-neutrino/webpack-chain/issues/42) from eliperelman/use-before-after
    Feature: allow specifying to use before or after other use
  * Feature: allow specifying .before or .after to order plugins and uses

2017-10-04
==========

  * Allow omitting keys from source merge object
  * Rename when arguments to be clearer

2017-10-01
==========

  * Merge pull request [#41](https://github.com/mozilla-neutrino/webpack-chain/issues/41) from edmorley/neutrino-docs-sync
    Docs: Upstream fixes made to Neutrino's webpack-chain docs
  * Docs: Upstream fixes made to Neutrino's webpack-chain docs
    Neutrino now has a slightly modified copy of the webpack-chain docs
    in its own repository:
    https://github.com/mozilla-neutrino/neutrino-dev/blob/master/docs/webpack-chain.md
    As part of that import, a few docs cleanups occurred that are also
    applicable to the docs in the webpack-chain repo. Upstreaming these
    reduces the size of the diff so should also make it easier to keep
    the two in sync in the future.

2017-09-26
==========

  * Merge pull request [#40](https://github.com/mozilla-neutrino/webpack-chain/issues/40) from edmorley/plugins-docs
    Improve documentation for plugin configuration

2017-09-24
==========

  * Improve documentation for plugin configuration
    Adds examples for deleting plugins (to make it clearer that the
    `.delete()` must be applied to the backing set and not using the
    shorthand form), and corrects some typos.

2017-09-12
==========

  * Update changelog
  * 4.3.0
  * Merge pull request [#38](https://github.com/mozilla-neutrino/webpack-chain/issues/38) from eliperelman/update-shorthands-devserver-config-output
    Update API for base config, dev server, and output
  * Update API for base config, dev server, and output
  * 4.2.0
  * Updating README with shorthands
  * Merge pull request [#37](https://github.com/mozilla-neutrino/webpack-chain/issues/37) from eliperelman/resolve-module-shorthands
    Add new shorthands from resolve and output
  * Add new shorthands from resolve and output

2017-09-11
==========

  * changelog
  * 4.1.0
  * Merge pull request [#36](https://github.com/mozilla-neutrino/webpack-chain/issues/36) from eliperelman/rule-oneof
    Updating rule definition shortcuts, adding oneOf
  * Updating rule definition shortcuts, adding oneOf

2017-08-02
==========

  * Release v4.0.0
  * Merge pull request [#32](https://github.com/mozilla-neutrino/webpack-chain/issues/32) from eliperelman/noparse-shorthand
    Switch noParse to getter/setter to allow webpack v3 function argument
  * Switch noParse to getter/setter to allow webpack v3 function argument
  * Merge pull request [#31](https://github.com/mozilla-neutrino/webpack-chain/issues/31) from psachs21/patch-1
    Serialize performance into config output

2017-07-20
==========

  * Serialize performance into config output
    Need to output performance to config object.

2017-05-17
==========

  * Releasing v3.3.0
  * Merge pull request [#27](https://github.com/mozilla-neutrino/webpack-chain/issues/27) from psachs21/noParse
    Adding noParse on module
  * Adding noParse on module

2017-04-11
==========

  * Merge pull request [#23](https://github.com/mozilla-neutrino/webpack-chain/issues/23) from eliperelman/devserver-additions
    Adding updated shorthand methods for devServer
  * Adding updated shorthand methods for devServer

2017-03-28
==========

  * v3.1.0
  * Merge pull request [#22](https://github.com/mozilla-neutrino/webpack-chain/issues/22) from eliperelman/when
    Allow conditional configuration via when
  * Allow conditional configuration via when

2017-03-08
==========

  * Update README with links to previous docs versions

2017-03-07
==========

  * Merge pull request [#16](https://github.com/mozilla-neutrino/webpack-chain/issues/16) from eliperelman/v3
    Make rule.include, rule.exclude, loaders and plugins more extensible
  * Make rule.include, rule.exclude, loaders and plugins more extensible
  * v2.0.1
  * Merge pull request [#17](https://github.com/mozilla-neutrino/webpack-chain/issues/17) from aretecode/patch-1
    undefined plugin
  * undefined plugin
    - unsure if this is the functionality intended, or if you mean to do different merging, but plugin variable is undefined.

2017-03-05
==========

  * MPL license, moving to mozilla-neutrino
  * Merge pull request [#14](https://github.com/mozilla-neutrino/webpack-chain/issues/14) from eliperelman/testing
    Adding testing, which informed v2 API, updated docs to reflect
  * Adding testing, which informed v2 API, updated docs to reflect

2017-03-03
==========

  * Merge pull request [#13](https://github.com/mozilla-neutrino/webpack-chain/issues/13) from eliperelman/plugin-api
    Make Plugin API consistent with Loader API
  * Make Plugin API consistent with Loader API
  * Removing empty entities from cluttering configuration object
  * Docs: getConfig -> toConfig

2017-03-02
==========

  * Adding ChainedMap and ChainedSet documentation

2017-03-01
==========

  * Bumping to v1.4.2
  * Merge pull request [#7](https://github.com/mozilla-neutrino/webpack-chain/issues/7) from tauren/patch-1
    Fix bug where `exclude` doesn't return `this`
  * Fix bug where `exclude` doesn't return `this`

2017-02-25
==========

  * v1.4.1
  * Merge pull request [#3](https://github.com/mozilla-neutrino/webpack-chain/issues/3) from eliperelman/merge-rule-loaders
    Allowing config merge to append to existing rule loaders
  * Allowing config merge to append to existing rule loaders

2017-02-20
==========

  * Merge pull request [#1](https://github.com/mozilla-neutrino/webpack-chain/issues/1) from BrainCrumbz/docs/devtool-typo
    docs(readme): fix typo in devtool option
  * docs(readme): fix typo in devtool option

2017-02-14
==========

  * Adds rule test merge via string to regex, fixes externals not chainable

2017-02-13
==========

  * Adding functionality for merging and object into a Config instance

2017-02-12
==========

  * Adds hot flag for Config.DevServer
  * Adding ChainedSet#prepend functionality

2017-02-09
==========

  * Fixes exception with empty rule entries with loader only

2017-02-08
==========

  * Fixes plugin methods not chaining
  * Avoid exceptions in empty config

2017-02-05
==========

  * Shared configuration documentation
  * initial commit
