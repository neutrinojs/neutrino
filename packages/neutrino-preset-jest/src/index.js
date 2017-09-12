const yargs = require('yargs');
const jest = require('jest-cli');
const jestOptions = require('jest-cli/build/cli/args').options;
const { omit } = require('ramda');
const merge = require('deepmerge');
const loaderMerge = require('neutrino-middleware-loader-merge');
const { isAbsolute, join } = require('path');
const { tmpdir } = require('os');
const { writeFileSync } = require('fs');

const mediaNames = '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$';
const styleNames = '\\.(css|less|sass|scss)$';
const jsNames = '\\.(js|jsx)$';

function getFinalPath(path) {
  if (isAbsolute(path)) {
    return path;
  }

  return path.startsWith('.') ?
    join('<rootDir>', path) :
    join('<rootDir>', 'node_modules', path);
}

function normalizeJestOptions(opts, neutrino) {
  const aliases = neutrino.config.resolve.alias.entries() || {};
  const moduleNames = Object
    .keys(aliases)
    .reduce((mapper, key) => Object.assign(mapper, {
      [`${key}(.*)`]: `${getFinalPath(aliases[key])}$1`
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
    'js',
    'jsx',
    ...(opts.moduleFileExtensions || []),
    ...neutrino.config.resolve.extensions.values().map(e => e.replace('.', ''))
  ])];

  return merge.all([
    {
      moduleDirectories,
      moduleFileExtensions,
      moduleNameMapper,
      bail: true,
      roots: [neutrino.options.tests],
      testRegex: '(_test|_spec|\\.test|\\.spec)\\.jsx?$',
      transform: { [jsNames]: require.resolve('./transformer') },
      globals: {
        BABEL_OPTIONS: omit(
          ['cacheDirectory'],
          neutrino.config.module
            .rule('compile')
            .use('babel')
            .get('options')
        )
      }
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
    neutrino.use(loaderMerge('compile', 'babel'), {
      env: {
        test: {
          retainLines: true,
          presets: [require.resolve('babel-preset-jest')],
          plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
        }
      }
    });

    return new Promise((resolve, reject) => {
      // We need to parse argv separately in order to identify files
      // and jest-related options since root neutrino does not know about
      // jest options and will provide wrong/incomplete `args.files`
      const jestArgs = yargs
        .command('test [files..]', 'Run tests', jestOptions)
        .argv;
      const configFile = join(tmpdir(), 'config.json');
      const options = normalizeJestOptions(opts, neutrino);
      const cliOptions = Object.assign(jestArgs,
        {
          // Jest is looking for Array of files in `argv._`. Providing them
          _: jestArgs.files,
          config: configFile,
          coverage: args.coverage,
          watch: args.watch
        });

      writeFileSync(configFile, `${JSON.stringify(options, null, 2)}\n`);

      jest.runCLI(cliOptions, options.roots, result =>
        (result.numFailedTests || result.numFailedTestSuites ?
          reject() :
          resolve()));
    });
  });
};
