const Future = require('fluture');
const merge = require('deepmerge');
const clone = require('lodash.clonedeep');
const { CLIEngine } = require('eslint');
const codeframe = require('eslint/lib/formatters/codeframe');
const {
  assoc, curry, evolve, keys, omit, pipe, prop, reduce
} = require('ramda');
const { basename, join } = require('path');

const MODULES = join(__dirname, 'node_modules');
const getEslintOptions = config => config.module.rule('lint').use('eslint').get('options');
const renameKeys = curry((definition, obj) =>
  reduce((acc, key) => assoc(definition[key] || key, obj[key], acc), {}, keys(obj)));
const reduceToTrueKeys = reduce((acc, key) => assoc(key, true, acc), {});
const getEslintRcConfig = pipe(
  getEslintOptions,
  clone,
  // We remove these keys since they are needed when running the lint command but
  // not the eslintrc command. The lint command uses ESLint's CLIEngine, but the
  // ESLint RC format does not match the CLIEngine format exactly. We must remove
  // anything we add that does not comply with ESLint's schemas.
  // https://github.com/eslint/eslint/blob/9d1df92628dd4dd1e70fbb19454008e146387435/conf/config-schema.js
  // https://github.com/eslint/eslint/blob/9d1df92628dd4dd1e70fbb19454008e146387435/lib/config/config-validator.js#L167
  omit([
    'failOnError',
    'emitWarning',
    'emitError',
    'cwd',
    'useEslintrc',
    'fix',
    'extensions',
    'formatter'
  ]),
  renameKeys({ envs: 'env', baseConfig: 'extends' }),
  evolve({
    extends: prop('extends'),
    globals: reduceToTrueKeys,
    env: reduceToTrueKeys
  })
);

module.exports = (neutrino, opts = {}) => {
  const options = merge.all([
    opts,
    !opts.include ? { include: [neutrino.options.source] } : {}
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
        .test(options.test || neutrino.regexFromExtensions())
        .pre()
        .when(options.include, rule => rule.include.merge(options.include))
        .when(options.exclude, rule => rule.exclude.merge(options.exclude))
        .use('eslint')
          .loader(require.resolve('eslint-loader'))
          .options(merge({
            failOnError: neutrino.options.command !== 'start',
            cwd: neutrino.options.root,
            useEslintrc: false,
            root: true,
            formatter: codeframe,
            // eslint-loader uses executeOnText(), which ignores the `extensions` setting.
            // However it's still needed for the lint command, as it uses executeOnFiles().
            extensions: neutrino.options.extensions,
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

  neutrino.register(
    'eslintrc',
    () => getEslintRcConfig(neutrino.config),
    'Return an object of accumulated ESLint configuration suitable for use by .eslintrc.js'
  );

  neutrino.register(
    'lint',
    () => {
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
        .chain(cli => Future.both(
          Future.of(cli.executeOnFiles(options.include)),
          Future.of(cli.getFormatter('codeframe'))
        ))
        .map(([report, formatter]) => {
          if (fix) {
            CLIEngine.outputFixes(report);
          }

          return [report, formatter];
        })
        .chain(([report, formatter]) => {
          const formatted = formatter(report.results);
          const errors = CLIEngine.getErrorResults(report.results);

          return errors.length ? Future.reject(formatted) : Future.of(formatted);
        });
    },
    'Perform a one-time lint using ESLint. Apply available automatic fixes with --fix'
  );
};
