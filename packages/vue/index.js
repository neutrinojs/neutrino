const loaderMerge = require('@neutrinojs/loader-merge');
const web = require('@neutrinojs/web');
const merge = require('deepmerge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    style: {
      ruleId: 'style',
      styleUseId: 'style',
      exclude: [],
      modulesTest: neutrino.regexFromExtensions(['css']),
      modulesSuffix: ''
    }
  }, opts);

  neutrino.use(web, options);

  neutrino.config.module
    .rule(options.style.ruleId)
    .use(options.style.styleUseId)
    .loader(require.resolve('vue-style-loader'));

  neutrino.config.module
    .rule('vue')
      .test(neutrino.regexFromExtensions(['vue']))
      .use('vue')
        .loader(require.resolve('vue-loader'));

  neutrino.config.plugin('vue').use(VueLoaderPlugin);

  if (neutrino.config.module.rules.has('compile')) {
    neutrino.config.module
      .rule('compile')
      .test(neutrino.regexFromExtensions(
        neutrino.options.extensions.filter(ext => ext !== 'vue'))
      );
  }

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      baseConfig: {
        extends: ['plugin:vue/base']
      },
      plugins: ['vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: 'babel-eslint'
      }
    });
  });
};
