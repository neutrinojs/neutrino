const web = require('@neutrinojs/web');
const path = require('path');
const arrify = require('arrify');
const merge = require('deepmerge');

const LOADER_EXTENSIONS = /\.vue$/;
const MODULES = path.join(__dirname, 'node_modules');

module.exports = (neutrino, options) => {
  const lintRule = neutrino.config.module.rules.get('lint');
  const compileRule = neutrino.config.module.rules.get('compile');

  neutrino.config.module.rule('vue')
    .test(LOADER_EXTENSIONS)
    .use('vue')
    .loader(require.resolve('vue-loader'))
    .options(options);

  neutrino.config.resolve.extensions.add('.vue');

  if (compileRule && compileRule.uses.has('babel')) {
    const babelOptions = compileRule.use('babel').get('options');
    neutrino.config.module
      .rule('vue')
      .use('vue')
      .tap((vueLoaderOptions = {}) => merge({
        loaders: {
          js: {
            loader: 'babel-loader',
            options: babelOptions
          }
        }
      }, vueLoaderOptions));
  }

  neutrino.use(web, options);

  if (lintRule) {
    // ensure conditions is an array of original values plus our own regex
    const conditions = arrify(lintRule.get('test')).concat([LOADER_EXTENSIONS]);
    neutrino.config.module
      .rule('lint')
      .test(conditions)
      .use('eslint')
      .tap(options => merge(options, {
        plugins: ['vue'],
        envs: ['node'],
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        },
        rules: {
          'vue/jsx-uses-vars': 2
        }
      }));
  }

  if (neutrino.config.plugins.has('stylelint')) {
    neutrino.config.plugin('stylelint')
      .tap(args => [
        merge(args[0], {
          files: ['**/*.vue'],
          config: {
            processors: [require.resolve('stylelint-processor-html')],
            rules: {
              // allows empty <style> in vue components
              'no-empty-source': null
            }
          }
        })
      ]);
  }

  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);
};
