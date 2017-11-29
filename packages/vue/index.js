const loaderMerge = require('@neutrinojs/loader-merge');
const web = require('@neutrinojs/web');
const merge = require('deepmerge');
const path = require('path');

const MODULES = path.join(__dirname, 'node_modules');

module.exports = (neutrino, options) => {
  neutrino.use(web, options);

  neutrino.config.module
    .rule('vue')
      .test(neutrino.regexFromExtensions(['vue']))
      .use('vue')
        .loader(require.resolve('vue-loader'))
        .options(options);

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      plugins: ['vue'],
      envs: ['node'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'vue/jsx-uses-vars': 'error'
      }
    });
  });

  if (neutrino.config.plugins.has('stylelint')) {
    neutrino.config
      .plugin('stylelint')
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

  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);
};
