const merge = require('deepmerge');
const { basename, isAbsolute, join, relative } = require('path');
const { media, style } = require('neutrino/extensions');

module.exports = (neutrino, options = {}) => {
  const lintRule = neutrino.config.module.rules.get('lint');
  if (lintRule) {
    lintRule.use('eslint').tap(
      // Don't adjust the lint configuration for projects using their own .eslintrc.
      lintOptions => lintOptions.useEslintrc
        ? lintOptions
        : merge(lintOptions, {
            baseConfig: {
              extends: ['plugin:jest/recommended']
            }
          })
    );
  }

  neutrino.register('jest', (neutrino) => {
    const compileRule = neutrino.config.module.rules.get('compile');
    const babelOptions = compileRule ? compileRule.use('babel').get('options') : {};
    // Any parts of the babel config that are not serializable will be omitted, however
    // that also occurs when passing to the custom transformer using `globals` instead.
    process.env.JEST_BABEL_OPTIONS = JSON.stringify(babelOptions);

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

    return merge({
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
      testEnvironment: neutrino.config.get('target') === 'node' ? 'node' : 'jsdom',
      testRegex: `${basename(tests)}/.*(_test|_spec|\\.test|\\.spec)\\.(${
        extensions.join('|')
        })$`,
      verbose: debug,
      transform: {
        // neutrino.options.extensions should be used instead of
        // neutrino.regexFromExtensions() because transformNames is used as a
        // property name where a Regex object will cause issues. e.g.:
        // https://github.com/neutrinojs/neutrino/issues/638.
        [extensionsToNames(extensions)]: require.resolve('./transformer')
      }
    }, options);
  });
};
