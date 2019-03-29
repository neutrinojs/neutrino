module.exports = {
  '*.{js,jsx}': ['yarn lint', 'yarn validate:eslintrc'],
  '*.{css,html,js,jsx,json,md,yaml,yml}': ['yarn prettier:check'],
};
