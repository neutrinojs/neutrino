const { compile } = require('ejs');
const { readFileSync } = require('fs-extra');
const { stringify } = require('javascript-stringify');
const { join } = require('path');

const RE_INDENT = /^(?!\s*$)/gm;
const isYarn =
  process.env.npm_config_user_agent &&
  process.env.npm_config_user_agent.includes('yarn');
const cli = isYarn ? 'yarn' : 'npm';
const yarnReplacers = new Map();
const npmReplacers = new Map();

yarnReplacers.set(/^run /, '');
yarnReplacers.set(/^install /, 'add ');
yarnReplacers.set(/--save-dev/, '--dev');
npmReplacers.set(/--dev/, '--save-dev');
npmReplacers.set(/^add /, 'install ');
npmReplacers.set(/--fix/, '-- --fix');

const packageManager = (command, registry) => {
  if (!command) {
    return cli;
  }

  const formatted = [...(isYarn ? yarnReplacers : npmReplacers)].reduce(
    (command, [matcher, replacement]) =>
      matcher.test(command) ? command.replace(matcher, replacement) : command,
    command,
  );

  return registry
    ? `${cli} --registry ${registry} ${formatted}`
    : `${cli} ${formatted}`;
};

const packageLint = (jsx = false, vue = false, test = false) => {
  // The list of extensions here needs to be kept in sync with the extension
  // list defined by neutrino/extensions.source. Modifying a value here should
  // have an accompanying change there as well. We can't pull in neutrino here
  // as that would potentially give us conflicting versions in node_modules.
  const exts = ['mjs', vue && 'vue', jsx && 'jsx', 'js']
    .filter(Boolean)
    .join(',');
  const dirs = ['src', test && 'test'].filter(Boolean).join(' ');

  return {
    scripts: {
      lint: `eslint --cache --format codeframe --ext ${exts} ${dirs}`,
    },
  };
};

const rcTemplate = compile(
  readFileSync(
    join(__dirname, 'templates/neutrino/.neutrinorc.js.ejs'),
  ).toString(),
);

const getNeutrinorcOptions = (name, project) => {
  if (!project.options) {
    return '';
  }

  const [head, ...tail] = stringify(project.options(name), null, 2).split('\n');

  return `${head}\n${tail.join('\n').replace(RE_INDENT, '    ')}`;
};

module.exports = {
  getNeutrinorcOptions,
  packageLint,
  packageManager,
  rcTemplate,
};
