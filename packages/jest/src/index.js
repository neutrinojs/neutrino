const yargs = require('yargs');
const jest = require('jest-cli');
const jestOptions = require('jest-cli/build/cli/args').options;
const { omit } = require('ramda');
const merge = require('deepmerge');
const loaderMerge = require('@neutrinojs/loader-merge');
const { isAbsolute, basename, join, relative } = require('path');
const { tmpdir } = require('os');
const { writeFileSync } = require('fs');

const mediaExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'webp', 'svg', 'ttf', 'woff', 'woff2', 'mp4', 'webm', 'wav', 'mp3', 'm4a', 'aac', 'oga'];

function getFinalPath(path) {
  if (isAbsolute(path)) {
    return path;
  }

  return path.startsWith('.') ?
    join('<rootDir>', path) :
    join('<rootDir>', 'node_modules', path);
}

function normalizeJestOptions(opts, neutrino, usingBabel) {
  const mediaNames = `\\.(${mediaExtensions.join('|')})$`;
  const styleNames = `\\.(${['css', 'less', 'sass', 'scss'].join('|')})$`;

  // neutrino.options.extensions should be used instead of neutrino.regexFromExtensions()
  // because transformNames is used as a property name where a Regex object will cause issues.
  // e.g., https://github.com/mozilla-neutrino/neutrino-dev/issues/638.
  const transformNames = `\\.(${neutrino.options.extensions.join('|')})$`;
  const aliases = neutrino.config.resolve.alias.entries() || {};
  const moduleNames = Object
    .keys(aliases)
    .reduce((mapper, key) => Object.assign(mapper, {
      [`^${key}$`]: `${getFinalPath(aliases[key])}$1`
    }), {});
  const moduleNameMapper = merge({
    [mediaNames]: require.resolve('./file-mock'),
    [styleNames]: require.resolve('./style-mock')
  }, moduleNames);
  const moduleDirectories = [...new Set([
    join(__dirname, '../node_modules'),
    ...(opts.moduleDirectories || []),
    ...neutrino.config.resolve.modules.values()
  ])];
  const moduleFileExtensions = [...new Set([
    ...(opts.moduleFileExtensions || []),
    ...neutrino.config.resolve.extensions.values().map(e => e.replace('.', ''))
  ])];

  const { extensions, source, tests, root } = neutrino.options
  const collectCoverageFrom = [join(relative(root, source), `**/*.{${extensions.join(',')}}`)]

  const testRegex = `${basename(tests)}/.*(_test|_spec|\\.test|\\.spec)\\.(${extensions.join('|')})$`;

  return merge.all([
    {
      rootDir: root,
      moduleDirectories,
      moduleFileExtensions,
      moduleNameMapper,
      bail: true,
      coveragePathIgnorePatterns: [neutrino.options.node_modules],
      collectCoverageFrom,
      testRegex,
      transform: { [transformNames]: require.resolve('./transformer') },
      globals: {
        BABEL_OPTIONS: usingBabel
          ? omit(['cacheDirectory'], neutrino.config.module.rule('compile').use('babel').get('options'))
          : {}
      },
      verbose: neutrino.options.debug
    },
    opts
  ]);
}

module.exports = (neutrino, opts = {}) => {
  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => neutrino
    .use(loaderMerge('lint', 'eslint'), {
      plugins: ['jest'],
      envs: ['jest/globals'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/valid-expect': 'error'
      }
    }));

  neutrino.on('test', (args) => {
    const usingBabel = neutrino.config.module.rules.has('compile');

    neutrino.config.when(usingBabel, () => {
      neutrino.use(loaderMerge('compile', 'babel'), {
        retainLines: true,
        presets: [require.resolve('babel-preset-jest')],
        plugins: [
          require.resolve('babel-plugin-transform-es2015-modules-commonjs')
        ]
      });
    });

    // We need to parse argv separately in order to identify files
    // and jest-related options since root neutrino does not know about
    // jest options and will provide wrong/incomplete `args.files`
    const jestArgs = yargs
      .command('test [files..]', 'Run tests', jestOptions)
      .argv;
    const configFile = join(tmpdir(), 'config.json');
    const options = normalizeJestOptions(opts, neutrino, usingBabel);
    const cliOptions = Object.assign(
      jestArgs,
      {
        // Jest is looking for Array of files in `argv._`. Providing them
        _: jestArgs.files,
        config: configFile,
        coverage: args.coverage,
        watch: args.watch
      }
    );

    writeFileSync(configFile, `${JSON.stringify(options, null, 2)}\n`);

    return jest
      .runCLI(cliOptions, options.roots || [options.rootDir])
      .then(({ results }) => results.success ? Promise.resolve() : Promise.reject());
  });
};
