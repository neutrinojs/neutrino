module.exports = {
  '*.{js,jsx}': ['yarn lint'],
  '*.{css,html,js,jsx,json,md,yaml,yml}': ['yarn prettier:check'],
};
