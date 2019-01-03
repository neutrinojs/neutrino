const web = require('@neutrinojs/web');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    style: {
      ruleId: 'style',
      styleUseId: 'style',
      modulesSuffix: '-modules',
      modules: true
    }
  }, opts);

  // Add vue extension as a higher priority than JS files.
  // Since neutrino.options.extensions is always a copy of a Set,
  // this splice operation is always mutation-safe.
  const { extensions } = neutrino.options;
  const index = extensions.indexOf('js');

  extensions.splice(index, 0, 'vue');

  neutrino.options.extensions = extensions; // eslint-disable-line no-param-reassign
  neutrino.use(web, options);

  // vue-loader needs CSS files to be parsed with vue-style-loader instead of
  // style-loader, so we replace the loader with the one vue wants.
  // This is only required when using style-loader and not when extracting CSS.
  const styleRule = neutrino.config.module.rules.get(options.style.ruleId);
  const styleModulesRule = neutrino.config.module.rules.get(`${options.style.ruleId}${options.style.modulesSuffix}`);

  [styleRule, styleModulesRule].forEach(rule => {
    rule
      .when(rule && rule.uses.has(options.style.styleUseId), rule => {
        rule
          .use(`${options.style.styleUseId}`)
          .loader(require.resolve('vue-style-loader'));
      });
  });

  // Rebuild our style rule to be a oneOf, first matching vue component styles
  styleRule
    .when(styleModulesRule && options.style.modules, rule => {
      rule.oneOf(`vue-${options.style.ruleId}${options.style.modulesSuffix}`)
        .resourceQuery(/module/)
        .uses
          .merge(styleModulesRule.uses.entries());
    })
    .oneOf(`vue-${options.style.ruleId}`)
      .resourceQuery(/\?vue/)
      .uses
        .merge(styleRule.uses.entries())
        .end()
      .end()
    .oneOf(options.style.ruleId)
      .uses
        .merge(styleRule.uses.entries())
        .end()
      .end()
    .uses
      .clear();

  neutrino.config.module
    .rule('vue')
      .test(neutrino.regexFromExtensions(['vue']))
      .use('vue')
        .loader(require.resolve('vue-loader'));

  neutrino.config.plugin('vue').use(require.resolve('vue-loader/lib/plugin'));

  if (neutrino.config.module.rules.has('compile')) {
    // We need to remove vue files from being parsed by Babel since the
    // vue-loader/VueLoaderPlugin will break down a vue file into its component
    // part files. For example, the <script> in a vue file becomes a JS file,
    // which will then be parsed by Babel, so no need for a double parse.
    neutrino.config.module
      .rule('compile')
      .test(neutrino.regexFromExtensions(
        neutrino.options.extensions.filter(ext => ext !== 'vue'))
      );
  }

  const lintRule = neutrino.config.module.rules.get('lint');
  if (lintRule) {
    // We need to re-set the extension list used by the eslint settings
    // since when it was generated it didn't include the vue extension.
    lintRule.test(neutrino.regexFromExtensions());

    lintRule.use('eslint').tap(
      // Don't adjust the lint configuration for projects using their own .eslintrc.
      lintOptions => lintOptions.useEslintrc
        ? lintOptions
        : merge(lintOptions, {
            baseConfig: {
              extends: ['plugin:vue/base'],
              parser: 'vue-eslint-parser',
              parserOptions: {
                parser: 'babel-eslint'
              },
              plugins: ['vue']
            }
          })
    );
  }
};
