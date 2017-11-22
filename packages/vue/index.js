const web = require('@neutrinojs/web');
const path = require('path');
const arrify = require('arrify');
const merge = require('deepmerge');

const LOADER_EXTENSIONS = /\.vue$/;
const MODULES = path.join(__dirname, 'node_modules');

module.exports = (neutrino, options) => {
  neutrino.use(web, options);

  const lintRule = neutrino.config.module.rules.get('lint');

  neutrino.config.module.rule('vue')
    .test(LOADER_EXTENSIONS)
    .use('vue')
    .loader(require.resolve('vue-loader'))
    .options(options);

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
      .tap(([options, ...args]) => [
        merge(options, {
          files: ['**/*.vue'],
          config: {
            processors: [require.resolve('stylelint-processor-html')],
            rules: {
              // allows empty <style> in vue components
              'no-empty-source': null
            }
          }
        }),
        ...args
      ]);
  }

  neutrino.config
    .resolve
      .modules.add(MODULES).end()
      .extensions.add('.vue').end()
      .end()
    .resolveLoader.modules.add(MODULES);
};
