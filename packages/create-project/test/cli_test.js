import test from 'ava';
import assert from 'yeoman-assert';
import { run } from 'yeoman-test';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawn } from 'child-process-async';
import { N, presets } from '../commands/init/constants';

const REGISTRY = 'http://localhost:4873';
const { env } = process;
const tests = [
  {
    project: presets.get(N.REACT),
    linter: presets.get(N.AIRBNB),
    testRunner: presets.get(N.JEST),
  },
  {
    project: presets.get(N.PREACT),
    linter: presets.get(N.AIRBNB),
    testRunner: presets.get(N.KARMA),
  },
  {
    project: presets.get(N.VUE),
    linter: presets.get(N.AIRBNB_BASE),
  },
  {
    project: presets.get(N.NODE),
    linter: presets.get(N.AIRBNB_BASE),
    testRunner: presets.get(N.MOCHA),
  },
  {
    project: presets.get(N.REACT_COMPONENTS),
    linter: presets.get(N.STANDARDJS),
  },
  {
    project: presets.get(N.WEB_NODE_LIBRARY),
    linter: presets.get(N.STANDARDJS),
  },
  {
    project: presets.get(N.WEB),
    linter: presets.get(N.AIRBNB_BASE),
  },
];
const scaffold = async ({ testName, ...prompts }) => {
  // Replace special characters in the test name to ensure that it can be
  // used as a valid directory name.
  const directory = `${join(
    tmpdir(),
    testName.replace(/[/+ @:]/g, '_'),
  )}_${Math.random()
    .toString(36)
    .substr(2)}`;

  await run(require.resolve(join(__dirname, '../commands/init')))
    .withOptions({
      directory,
      name: testName,
      registry: REGISTRY,
    })
    .withPrompts(prompts);

  return directory;
};
const yarn = async (t, cwd, args) => {
  try {
    const { stderr, exitCode } = await spawn('yarn', args, { cwd, env });

    if (exitCode === 0) {
      t.pass();
    } else {
      t.fail(`Failed to ${args[0]} project:\n\n${stderr}`);
    }
  } catch (err) {
    t.fail(`Failed to ${args[0]} project:\n\n${err}`);
  }
};
const buildable = async (t, cwd, args = []) => yarn(t, cwd, ['build', ...args]);
const testable = async (t, cwd, args = []) => yarn(t, cwd, ['test', ...args]);
const lintable = async (t, cwd, args = []) => yarn(t, cwd, ['lint', ...args]);

tests.forEach(({ project, linter, testRunner }) => {
  const testName = testRunner
    ? `create-project: ${project.name} + ${linter.name} + ${testRunner.name}`
    : `create-project: ${project.name} + ${linter.name}`;

  test.serial(testName, async t => {
    const dir = await scaffold({
      testName,
      projectType: project.projectType,
      project: project.package,
      linter: linter.package,
      testRunner: testRunner ? testRunner.package : false,
    });
    const pkgPath = join(dir, 'package.json');

    t.truthy(dir);
    assert.file(pkgPath);
    assert.file(join(dir, '.neutrinorc.js'));
    assert.file(join(dir, 'webpack.config.js'));
    assert.file(join(dir, '.eslintrc.js'));
    assert.file(join(dir, '.gitignore'));

    await lintable(t, dir);
    await buildable(t, dir);

    const pkg = require(pkgPath); // eslint-disable-line import/no-dynamic-require

    // Building in development mode to emulating running webpack-dev-server
    // or webpack --watch without actually spawning the process and waiting.
    // TODO: Find a way in the future to actually test that the spawned watchers
    // produce the expected result.
    if ('start' in pkg.scripts) {
      await buildable(t, dir, ['--', '--mode', 'development']);
    }

    if (testRunner) {
      if (testRunner.package === N.JEST) {
        assert.file(join(dir, 'jest.config.js'));
      } else if (testRunner.package === N.KARMA) {
        assert.file(join(dir, 'karma.conf.js'));
      } else if (testRunner.package === N.MOCHA) {
        assert.file(join(dir, '.mocharc.js'));
      }

      assert.file(join(dir, 'test/simple_test.js'));
      await testable(t, dir);
    }
  });
});
