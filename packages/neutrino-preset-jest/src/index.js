const { runCLI } = require('jest-cli');
const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const os = require('os');
const pkg = require(path.join(process.cwd(), 'package.json'));

function getBabelOptions(config) {
  let loader;

  config.module.rules.some(r => {
    let l = r.use.find(l => l.loader.includes('babel-loader'));

    if (l) {
      loader = l;
      return true;
    }

    return false;
  });

  return loader.options;
}

function normalizeJestConfig(jest, config, args) {
  const extensions = new Set(jest.moduleFileExtensions || []);
  const directories = new Set(jest.moduleDirectories || []);

  Object
    .keys(config.alias || {})
    .map(key => jest.moduleNameMapper[key] = path.join('<rootDir>', config.alias[key]));

  config.resolve.extensions.forEach(e => extensions.add(e.replace('.', '')));
  config.resolve.modules.forEach(m => directories.add(m));
  jest.moduleFileExtensions = [...extensions];
  jest.moduleDirectories = [...directories];
  jest.globals = Object.assign({}, jest.globals, { BABEL_OPTIONS: getBabelOptions(config) });

  if (args.files.length) {
    jest.testRegex = args.files.join('|').replace('.', '\\.');
  }

  return Object.assign({}, jest, pkg.jest);
}

module.exports = neutrino => {
  neutrino.on('test', (config, args) => {
    const jest = normalizeJestConfig(neutrino.custom.jest, config, args);
    const configFile = path.join(os.tmpdir(), 'config.json');

    return new Promise((resolve, reject) => {
      fs.writeFileSync(configFile, `${JSON.stringify(jest, null, 2)}\n`);

      runCLI(
        { config: configFile, watch: args.watch },
        jest.rootDir || process.cwd(),
        result => {
          if (result.numFailedTests || result.numFailedTestSuites) {
            reject();
          } else {
            resolve();
          }
        });
    });
  });

  neutrino.custom.jest = {
    bail: true,
    transform: {
      "\\.(js|jsx)$": require.resolve('./transformer')
    },
    testPathDirs: [path.join(process.cwd(), 'test')],
    testRegex: '(_test|_spec|\\.test|\\.spec)\\.jsx?$',
    moduleFileExtensions: ['js', 'jsx'],
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve('./file-mock'),
      '\\.(css|less|sass)$': require.resolve('./style-mock')
    }
  };

  const config = neutrino.configs.find(c => c.module.rules.has('compile'));

  config
    .module
    .rule('compile')
    .loader('babel', ({ options }) => {
      return {
        options: merge(options, {
          env: {
            test: {
              retainLines: true,
              presets: [require.resolve('babel-preset-jest')],
              plugins: [require.resolve('babel-plugin-transform-es2015-modules-commonjs')]
            }
          }
        })
      };
    });
};
