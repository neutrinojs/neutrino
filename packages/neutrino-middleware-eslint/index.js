const Future = require('fluture');
const merge = require('deepmerge');
const clone = require('lodash.clonedeep');
const { CLIEngine } = require('eslint');
const { assoc, curry, evolve, keys, omit, pipe, prop, reduce } = require('ramda');
const { basename, join } = require('path');

const MODULES = join(__dirname, 'node_modules');
const getEslintOptions = config => config.module.rule('lint').use('eslint').get('options');
const renameKeys = curry((definition, obj) =>
  reduce((acc, key) => assoc(definition[key] || key, obj[key], acc), {}, keys(obj)));
const reduceToTrueKeys = reduce((acc, key) => assoc(key, true, acc), {});
const getEslintRcConfig = pipe(
  getEslintOptions,
  clone,
  assoc('useEslintrc', true),
  omit(['failOnError', 'emitWarning', 'emitError']),
  renameKeys({ envs: 'env', baseConfig: 'extends' }),
  evolve({
    extends: prop('extends'),
    globals: reduceToTrueKeys,
    env: reduceToTrueKeys
  })
);

module.exports = (neutrino, opts = {}) => {
  const isNotDev = process.env.NODE_ENV !== 'development';
  const options = merge.all([
    opts,
    !opts.include && !opts.exclude ? { include: [neutrino.options.source], exclude: [neutrino.options.static] } : {}
  ]);

  neutrino.config
    .resolve
      .modules
        .add(MODULES)
        .end()
      .end()
    .resolveLoader
      .modules
        .add(MODULES)
        .end()
      .end()
    .module
      .rule('lint')
        .test(options.test || /\.(js|jsx)$/)
        .pre()
        .when(options.include, rule => rule.include.merge(options.include))
        .when(options.exclude, rule => rule.exclude.merge(options.exclude))
        .use('eslint')
          .loader(require.resolve('eslint-loader'))
          .options(merge({
            failOnError: isNotDev,
            emitWarning: isNotDev,
            emitError: isNotDev,
            cwd: neutrino.options.root,
            useEslintrc: false,
            root: true,
            // eslint-loader uses executeOnText(), which ignores the `extensions` setting.
            // However it's still needed for the lint command, as it uses executeOnFiles().
            extensions: ['js', 'jsx'],
            plugins: ['babel'],
            baseConfig: {},
            envs: ['es6'],
            parser: 'babel-eslint',
            parserOptions: {
              ecmaVersion: 2017,
              sourceType: 'module',
              ecmaFeatures: {
                objectLiteralDuplicateProperties: false,
                generators: true,
                impliedStrict: true
              }
            },
            settings: {},
            globals: ['process'],
            rules: {}
          }, options.eslint || {}));

  neutrino.register('eslintrc', () => getEslintRcConfig(neutrino.config));
  neutrino.register('lint', () => {
    const { fix = false } = neutrino.options.args;
    const ignorePattern = (options.exclude || [])
      .map(exclude => join(
        basename(neutrino.options.source),
        basename(exclude),
        '**/*'
      ));
    const eslintConfig = merge(getEslintOptions(neutrino.config), { ignorePattern, fix });

    return Future
      .of(eslintConfig)
      .map(options => new CLIEngine(options))
      .chain(cli => Future.both(Future.of(cli.executeOnFiles(options.include)), Future.of(cli.getFormatter())))
      .map(([report, formatter]) => {
        fix && CLIEngine.outputFixes(report);
        return [report, formatter];
      })
      .chain(([report, formatter]) => {
        const errors = CLIEngine.getErrorResults(report.results);
        const formatted = formatter(report.results);

        return errors.length ? Future.reject(formatted) : Future.of(formatted);
      });
  });
};
