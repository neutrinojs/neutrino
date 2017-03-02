module.exports = options => config => config.module
  .rule('compile')
  .test(/\.js$/)
  .include(...options.include)
  .loader('babel', require.resolve('babel-loader'), options.babel);
