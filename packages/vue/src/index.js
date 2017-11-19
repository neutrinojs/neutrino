const path = require('path');
const arrify = require('arrify');
const merge = require('deepmerge');

const LOADER_EXTENSIONS = /\.vue$/;
const MODULES = path.join(__dirname, 'node_modules');

module.exports = ({ config }, options) => {
  const styleRule = config.module.rules.get('style');
  const lintRule = config.module.rules.get('lint');
  const compileRule = config.module.rules.get('compile');

  config.module.rule('vue')
    .test(LOADER_EXTENSIONS)
    .use('vue')
    .loader(require.resolve('vue-loader'))
    .options(options);

  config.resolve.extensions.add('.vue');

  if (styleRule && styleRule.uses.has('postcss')) {
    const postcssLoaderOptions = styleRule.use('postcss').get('options');
    if (Object.getOwnPropertyNames(postcssLoaderOptions).length) { // check if object is not empty
      config.module
        .rule('vue')
        .use('vue')
        .tap((vueLoaderOptions = {}) => merge({
          postcss: postcssLoaderOptions
        }, vueLoaderOptions));
    }
  }

  if (compileRule && compileRule.uses.has('babel')) {
    const babelOptions = compileRule.use('babel').get('options');
    config.module
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

  if (lintRule) {
    // ensure conditions is an array of original values plus our own regex
    const conditions = arrify(lintRule.get('test')).concat([LOADER_EXTENSIONS]);
    config.module
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

  if (config.plugins.has('stylelint')) {
    config.plugin('stylelint')
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

  config.resolve.modules.add(MODULES);
  config.resolveLoader.modules.add(MODULES);
};
