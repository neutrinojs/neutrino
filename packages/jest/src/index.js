const loaderMerge = require('@neutrinojs/loader-merge');
const { merge } = require('@neutrinojs/compile-loader');
const omit = require('lodash.omit');
const { basename, isAbsolute, join, relative } = require('path');
const { media, style } = require('neutrino/extensions');

module.exports = neutrino => {
  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      plugins: ['jest'],
      envs: ['jest/globals'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/valid-expect': 'error'
      }
    });
  });

  neutrino.register('jest', (neutrino, override) => {
    const usingBabel = neutrino.config.module.rules.has('compile');

    if (usingBabel) {
      neutrino.config.module
        .rule('compile')
        .use('babel')
        .tap(options => merge(options, {
          plugins: [
            // Once babel-preset-jest has better Babel 7 support we should
            // switch back to it (or even use babel-jest, which will allow
            // simplifying the transformer too):
            // https://github.com/facebook/jest/issues/6126
            // For now this plugin is taken from here (we don't need
            // object-rest-spread since node >=8.3):
            // https://github.com/facebook/jest/blob/v22.4.2/packages/babel-preset-jest/index.js#L11-L12
            require.resolve('babel-plugin-jest-hoist'),
            // Since the tests will be run by node which doesn't yet support
            // ES2015 modules
            require.resolve('@babel/plugin-transform-modules-commonjs')
          ]
        }));
    }

    const babelOptions = usingBabel
      ? merge(
        omit(
          neutrino.config.module.rule('compile').use('babel').get('options'),
          ['cacheDirectory']
        ),
        {
          retainLines: true,
          plugins: [
            require.resolve('@babel/plugin-transform-modules-commonjs')
          ]
        }
      )
      : {};
    const getFinalPath = path => {
      if (isAbsolute(path)) {
        return path;
      }

      return path.startsWith('.')
        ? join('<rootDir>', path)
        : join('<rootDir>', 'node_modules', path);
    };
    const extensionsToNames = extensions => `\\.(${extensions.join('|')})$`;
    const {
      extensions,
      source,
      tests,
      root,
      debug
    } = neutrino.options;
    const modulesConfig = neutrino.config.resolve.modules.values();
    const aliases = neutrino.config.resolve.alias.entries() || {};

    return override({
      rootDir: root,
      moduleDirectories: modulesConfig.length ? modulesConfig : ['node_modules'],
      moduleFileExtensions: neutrino.config.resolve.extensions
        .values()
        .map(extension => extension.replace('.', '')),
      moduleNameMapper:
        Object
          .keys(aliases)
          .reduce((mapper, key) => ({
            ...mapper,
            [`^${key}$`]: `${getFinalPath(aliases[key])}$1`
          }), {
            [extensionsToNames(media)]: require.resolve('./file-mock'),
            [extensionsToNames(style)]: require.resolve('./style-mock')
          }),
      bail: true,
      collectCoverageFrom: [join(
        relative(root, source),
        `**/*.{${extensions.join(',')}}`
      )],
      testRegex: `${basename(tests)}/.*(_test|_spec|\\.test|\\.spec)\\.(${
        extensions.join('|')
        })$`,
      verbose: debug,
      transform: {
        // neutrino.options.extensions should be used instead of
        // neutrino.regexFromExtensions() because transformNames is used as a
        // property name where a Regex object will cause issues. e.g.:
        // https://github.com/mozilla-neutrino/neutrino-dev/issues/638.
        [extensionsToNames(extensions)]: require.resolve('./transformer')
      },
      globals: {
        BABEL_OPTIONS: babelOptions
      }
    });
  });
};
