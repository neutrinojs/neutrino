module.exports = ({ config }, options) => config.module
  .rule('compile')
  .test(options.test || /\.jsx?$/)
  .when(options.include, rule => rule.include.merge(options.include))
  .when(options.exclude, rule => rule.exclude.merge(options.exclude))
  .use('babel')
    .loader(require.resolve('babel-loader'))
    .options(options.babel);
