const { runCLI } = require('jest-cli');
const { writeFileSync } = require('fs');
const { join } = require('path');
const merge = require('deepmerge');
const { tmpdir } = require('os');
const clone = require('lodash.clonedeep');
const loaderMerge = require('neutrino-middleware-loader-merge');

function getFinalPath(path) {
  if (path[0] === '/') {
    return path;
  }
  if (path[0] === '.') {
    return join('<rootDir>', path);
  }
  return join('<rootDir>', 'node_modules', path);
}

function normalizeJestOptions(jestOptions, config, args) {
  const options = clone(jestOptions);
  const aliases = config.resolve.alias.entries() || {};
  Object
    .keys(aliases)
    .map((key) => {
      const finalPath = getFinalPath(aliases[key]);
      return Object.assign(options.moduleNameMapper, { [`${key}(.*)`]: `${finalPath}$1` });
    });

  options.moduleFileExtensions = [...new Set([
    ...options.moduleFileExtensions,
    ...config.resolve.extensions.values().map(e => e.replace('.', ''))
  ])];
  options.moduleDirectories = [...new Set([
    ...options.moduleDirectories,
    ...config.resolve.modules.values()
  ])];
  options.globals = Object.assign({
    BABEL_OPTIONS: config.module.rule('compile').use('babel').get('options')
  }, options.globals);

  if (args.files.length) {
    options.testRegex = args.files.join('|').replace('.', '\\.');
  }

  return options;
}

module.exports = (neutrino) => {
  neutrino.on('test', (args) => {
    const jestOptions = merge({
      bail: true,
      transform: {
        '\\.(js|jsx)$': require.resolve('./transformer')
      },
      roots: [neutrino.options.tests],
      testRegex: '(_test|_spec|\\.test|\\.spec)\\.jsx?$',
      moduleFileExtensions: ['js', 'jsx'],
      moduleDirectories: [join(__dirname, '../node_modules')],
      moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve('./file-mock'),
        '\\.(css|less|sass)$': require.resolve('./style-mock')
      }
    }, neutrino.options.jest || {});

    neutrino.use(loaderMerge('compile', 'babel'), {
      env: {
        test: {
          retainLines: true,
          presets: [require.resolve('babel-preset-jest')],
          plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
        }
      }
    });

    neutrino.config.when(neutrino.config.module.rules.has('lint'), () => neutrino
      .use(loaderMerge('lint', 'eslint'), {
        plugins: ['jest'],
        envs: ['jest']
      }));

    const options = normalizeJestOptions(jestOptions, neutrino.config, args);
    const configFile = join(tmpdir(), 'config.json');

    return new Promise((resolve, reject) => {
      const cliOptions = { config: configFile, coverage: args.coverage, watch: args.watch };
      const dir = options.rootDir || neutrino.options.root;

      writeFileSync(configFile, `${JSON.stringify(options, null, 2)}\n`);
      runCLI(cliOptions, dir, result => (result.numFailedTests || result.numFailedTestSuites ? reject() : resolve()));
    });
  });
};
