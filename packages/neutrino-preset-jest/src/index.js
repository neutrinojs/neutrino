const { runCLI } = require('jest-cli');
const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const os = require('os');
const pkg = require(path.join(process.cwd(), 'package.json'));

function normalizeJestConfig(neutrino, args) {
  const jest = neutrino.custom.jest;
  const config = neutrino.config;
  const aliases = config.options.get('alias') || {};

  Object
    .keys(aliases)
    .map(key => jest.moduleNameMapper[key] = path.join('<rootDir>', aliases[key]));

  jest.moduleFileExtensions = [...new Set([
    ...jest.moduleFileExtensions,
    ...config.resolve.extensions.values().map(e => e.replace('.', ''))
  ])];
  jest.moduleDirectories = [...new Set([
    ...jest.moduleDirectories,
    ...config.resolve.modules.values()
  ])];
  jest.globals = Object.assign({
    BABEL_OPTIONS: config.module.rule('compile').loaders.get('babel').options
  }, jest.globals);

  if (args.files.length) {
    jest.testRegex = args.files.join('|').replace('.', '\\.');
  }

  return Object.assign({}, jest, pkg.jest);
}

module.exports = neutrino => {
  neutrino.custom.jest = {
    bail: true,
    transform: {
      "\\.(js|jsx)$": require.resolve('./transformer')
    },
    testPathDirs: [path.join(process.cwd(), 'test')],
    testRegex: '(_test|_spec|\\.test|\\.spec)\\.jsx?$',
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: [path.join(__dirname, '../node_modules')],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve('./file-mock'),
      '\\.(css|less|sass)$': require.resolve('./style-mock')
    }
  };

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
    const jest = normalizeJestConfig(neutrino, args);
    const configFile = path.join(os.tmpdir(), 'config.json');

    return new Promise((resolve, reject) => {
      const jestCliOptions = { config: configFile, coverage: args.coverage, watch: args.watch };

      fs.writeFileSync(configFile, `${JSON.stringify(jest, null, 2)}\n`);
      runCLI(jestCliOptions, jest.rootDir || process.cwd(), result => {
        if (result.numFailedTests || result.numFailedTestSuites) {
          reject();
        } else {
          resolve();
        }
      });
    });
  });
};
