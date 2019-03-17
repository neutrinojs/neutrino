module.exports = {
  '*.js': ['yarn lint'],
  '*.{css,html,js,jsx,json,md,yaml,yml}': ['yarn prettier:check'],
};
