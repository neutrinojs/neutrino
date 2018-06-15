const loaderMerge = require('@neutrinojs/loader-merge');
const web = require('@neutrinojs/web');
const merge = require('deepmerge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    style: {
      loaders: [{
        loader: require.resolve('vue-style-loader'),
        useId: 'vue'
      }]
    }
  }, opts);

  neutrino.config.module
    .rule('vue')
      .test(neutrino.regexFromExtensions(['vue']))
      .use('vue')
        .loader(require.resolve('vue-loader'));

  neutrino.config.plugin('vue').use(VueLoaderPlugin);

  neutrino.use(web, options);

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
