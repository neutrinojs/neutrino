const merge = require('deepmerge');
const { basename, join } = require('path');
const Future = require('fluture');
const { CLIEngine } = require('eslint');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const isNotDev = process.env.NODE_ENV !== 'development';
  const options = merge.all([
    opts,
    !opts.include && !opts.exclude ? { include: [neutrino.options.source], exclude: [neutrino.options.static] } : {}
  ]);

  neutrino.register('lint', () => {
    const { fix = false } = neutrino.options.args;
    const ignorePattern = (options.exclude || [])
      .map(exclude => join(
        basename(neutrino.options.source),
        basename(exclude),
        '**/*'
      ));
    const eslintConfig = merge(
      neutrino.config.module.rule('lint').use('eslint').get('options'),
      { ignorePattern, fix }
    );

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
};
