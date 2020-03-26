module.exports = (api) =>
  api.config.module.rule('compile').test(api.regexFromExtensions(['js']));
