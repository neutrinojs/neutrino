import test from 'ava';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import { join } from 'path';
import { spawn } from 'child_process';
import { packages } from '../commands/init/matrix';

const REGISTRY = 'http://localhost:4873';
const tests = {
  [packages.REACT]: {
    linter: packages.AIRBNB,
    tester: packages.JEST
  },
  [packages.PREACT]: {
    linter: packages.AIRBNB,
    tester: packages.KARMA
  },
  [packages.VUE]: {
    linter: packages.AIRBNB_BASE
  },
  [packages.NODE]: {
    linter: packages.AIRBNB_BASE,
    tester: packages.MOCHA
  },
  [packages.REACT_COMPONENTS]: {
    linter: packages.STANDARDJS
  },
  [packages.WEB_NODE_LIBRARY]: {
    linter: packages.STANDARDJS
  },
  [packages.WEB]: {
    linter: packages.AIRBNB_BASE
  }
};
const project = (prompts) => helpers
  .run(require.resolve(join(__dirname, '../commands/init')))
  .inTmpDir(function(dir) {
    this.withOptions({
      directory: dir,
      name: 'testable',
      registry: REGISTRY
    });
  })
  .withPrompts(prompts)
  .toPromise();
const spawnP = (cmd, args, options) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, options);
  let output = '';

  child.stdout.on('data', data => output += data.toString());
  child.stderr.on('data', data => output += data.toString());
  child.on('close', (code) => {
    code === 0 ? resolve(code) : reject(output);
  });
});
const buildable = async (t, dir) => {
  try {
    await spawnP('yarn', ['build'], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (output) {
    t.fail(`Failed to build project:\n\n${output}`);
  }
};
const testable = async (t, dir) => {
  try {
    await spawnP('yarn', ['test'], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (output) {
    t.fail(`Failed to test project:\n\n${output}`);
  }
};
const lintable = async (t, dir) => {
  try {
    await spawnP('yarn', ['lint'], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (output) {
    t.fail(`Failed to lint project:\n\n${output}`);
  }
};

Object.keys(tests).forEach(projectName => {
  const { linter, tester } = tests[projectName];
  const projectType = projectName.includes('library')
    ? 'library'
    : projectName.includes('components')
      ? 'components'
      : 'application';
  const testName = tester
    ? `${projectName} + ${linter} + ${tester}`
    : `${projectName} + ${linter}`;

  test.serial(testName, async t => {
    const dir = await project({
      projectType,
      linter,
      project: projectName,
      testRunner: tester || false
    });

    t.truthy(dir);
    assert.file(join(dir, 'package.json'));
    assert.file(join(dir, '.neutrinorc.js'));
    assert.file(join(dir, '.eslintrc.js'));

    await lintable(t, dir);
    await buildable(t, dir);

    if (tester) {
      assert.file(join(dir, 'test/simple_test.js'));
      await testable(t, dir);
    }
  });
});
