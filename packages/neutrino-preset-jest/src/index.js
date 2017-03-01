const { runCLI } = require('jest-cli');
const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const os = require('os');
const clone = require('lodash.clonedeep');
const pkg = require(path.join(process.cwd(), 'package.json'));

function normalizeJestOptions(jestOptions, config, args) {
  const options = clone(jestOptions);
  const aliases = config.options.get('alias') || {};

  Object
    .keys(aliases)
    .map(key => options.moduleNameMapper[key] = path.join('<rootDir>', aliases[key]));

  options.moduleFileExtensions = [...new Set([
    ...options.moduleFileExtensions,
    ...config.resolve.extensions.values().map(e => e.replace('.', ''))
  ])];
  options.moduleDirectories = [...new Set([
    ...options.moduleDirectories,
    ...config.resolve.modules.values()
  ])];
  options.globals = Object.assign({
    BABEL_OPTIONS: config.module.rule('compile').loaders.get('babel').options
  }, options.globals);

  if (args.files.length) {
    options.testRegex = args.files.join('|').replace('.', '\\.');
  }

  return options;
}

module.exports = neutrino => {
  const jestOptions = merge.all([
    {
      bail: true,
      transform: {
        "\\.(js|jsx)$": require.resolve('./transformer')
      },
      roots: [path.join(process.cwd(), 'test')],
      testRegex: '(_test|_spec|\\.test|\\.spec)\\.jsx?$',
      moduleFileExtensions: ['js', 'jsx'],
      moduleDirectories: [path.join(__dirname, '../node_modules')],
      moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve('./file-mock'),
        '\\.(css|less|sass)$': require.resolve('./style-mock')
      }
    },
    pkg.jest,
    neutrino.options.jest
  ]);

  neutrino.config.module
    .rule('compile')
    .loader('babel', props => merge(props, {
      options: {
        env: {
          test: {
            retainLines: true,
            presets: [require.resolve('babel-preset-jest')],
            plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
          }
        }
      }
    }));

  if (neutrino.config.module.rules.has('lint')) {
    neutrino.config.module
      .rule('lint')
      .loader('eslint', props => merge(props, {
        options: {
          plugins: ['jest'],
          envs: ['jest']
        }
      }));
  }

  neutrino.on('test', args => {
    const options = normalizeJestOptions(jestOptions, neutrino.config, args);
    const configFile = path.join(os.tmpdir(), 'config.json');

    return new Promise((resolve, reject) => {
      const cliOptions = { config: configFile, coverage: args.coverage, watch: args.watch };
      const dir = options.rootDir || process.cwd();

      fs.writeFileSync(configFile, `${JSON.stringify(options, null, 2)}\n`);
      runCLI(cliOptions, dir, result => {
        if (result.numFailedTests || result.numFailedTestSuites) {
          reject();
        } else {
          resolve();
        }
      });
    });
  });
};
