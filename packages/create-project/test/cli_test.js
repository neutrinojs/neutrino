import test from 'ava';
import assert from 'yeoman-assert';
import { run } from 'yeoman-test';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawn } from 'child_process';
import { N, presets } from '../commands/init/constants';

const REGISTRY = 'http://localhost:4873';
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
const spawnP = (cmd, args, options) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options);
    let output = '';
    const handleData = data => {
      output += data.toString();
    };

    child.stdout.on('data', handleData);
    child.stderr.on('data', handleData);
    child.on('close', code => (code === 0 ? resolve(code) : reject(output)));
  });
const buildable = async (t, dir, args = []) => {
  try {
    await spawnP('yarn', ['build', ...args], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (output) {
    t.fail(`Failed to build project:\n\n${output}`);
  }
};
const testable = async (t, dir, args = []) => {
  try {
    await spawnP('yarn', ['test', ...args], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (output) {
    t.fail(`Failed to test project:\n\n${output}`);
  }
};
const lintable = async (t, dir, args = []) => {
  try {
    await spawnP('yarn', ['lint', ...args], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (output) {
    t.fail(`Failed to lint project:\n\n${output}`);
  }
};

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
