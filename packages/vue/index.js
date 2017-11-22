const web = require('@neutrinojs/web');
const path = require('path');
const merge = require('deepmerge');

const MODULES = path.join(__dirname, 'node_modules');

module.exports = (neutrino, options) => {
  neutrino.use(web, options);

  neutrino.config.module.rule('vue')
    .test(neutrino.options.extensions)
    .use('vue')
    .loader(require.resolve('vue-loader'))
    .options(options);

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => neutrino.config.module
    .rule('lint')
    .test(neutrino.options.extensions)
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
    })));

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
