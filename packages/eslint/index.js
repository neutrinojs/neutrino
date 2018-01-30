const Future = require('fluture');
const deepmerge = require('deepmerge');
const clone = require('lodash.clonedeep');
const { CLIEngine } = require('eslint');
const {
  assoc, curry, evolve, keys, omit, pathOr, pipe, prop, reduce
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

const merge = (source, destination) => {
  const sourceRules = pathOr({}, ['eslint', 'rules'], source);
  const destinationRules = pathOr({}, ['eslint', 'rules'], destination);
  const rules = deepmerge(sourceRules, destinationRules, {
    arrayMerge(source, destination) {
      return destination;
    }
  });
  const options = deepmerge(source, destination);

  Object.assign(options.eslint, { rules });

  return options;
};

module.exports = (neutrino, opts = {}) => {
  const defaults = {
    include: !opts.include ? [neutrino.options.source] : undefined,
    eslint: {
      failOnError: neutrino.options.command !== 'start',
      cwd: neutrino.options.root,
      useEslintrc: false,
      root: true,
      formatter: 'codeframe',
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
    }
  };
  const options = merge(defaults, opts);

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
          .options(typeof options.eslint.formatter === 'string'
            ? deepmerge(options.eslint, {
              // eslint-disable-next-line global-require
              formatter: require(`eslint/lib/formatters/${options.eslint.formatter}`)
            })
            : options.eslint);

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
      const eslintConfig = deepmerge(getEslintOptions(neutrino.config), { ignorePattern, fix });

      return Future
        .of(eslintConfig)
        .map(options => new CLIEngine(options))
        .chain(cli => Future.both(
          Future.of(cli.executeOnFiles(options.include)),
          Future.of(cli.getFormatter(options.eslint.formatter))
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

module.exports.merge = merge;
