import test from 'ava';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import { join } from 'path';
import { spawn } from 'child_process';

const REGISTRY = 'http://localhost:4873';

const project = (prompts) => helpers
  .run(require.resolve(join(__dirname, '../commands/init')))
  .inTmpDir(function(dir) {
    this.withOptions({
      directory: dir,
      name: 'testable',
      registry: REGISTRY,
    });
  })
  .withPrompts(prompts)
  .toPromise();
const usable = (dir, files) => {
  files.forEach(file => {
    assert.file(join(dir, file));
  });
};
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

if (!process.env.PROJECT || process.env.PROJECT === 'all') {
  throw new Error('Missing valid $PROJECT environment for create-project test');
}

if (process.env.LINTER) {
  test(`${process.env.PROJECT} + ${process.env.LINTER}`, async t => {
    const dir = await project({
      projectType: 'application',
      project: process.env.PROJECT,
      testRunner: false,
      linter: process.env.LINTER
    });

    t.truthy(dir);
    assert.file(join(dir, 'package.json'));
    assert.file(join(dir, '.neutrinorc.js'));
    assert.file(join(dir, '.eslintrc.js'));

    await lintable(t, dir);
    await buildable(t, dir);
  });
} else if (process.env.TEST_RUNNER) {
  test(`${process.env.PROJECT} + ${process.env.TEST_RUNNER}`, async t => {
    const dir = await project({
      projectType: 'application',
      project: process.env.PROJECT,
      testRunner: process.env.TEST_RUNNER,
      linter: false
    });

    t.truthy(dir);
    assert.file(join(dir, 'package.json'));
    assert.file(join(dir, '.neutrinorc.js'));
    assert.file(join(dir, 'test/simple_test.js'));

    await testable(t, dir);
    await buildable(t, dir);
  });
} else {
  test(process.env.PROJECT, async t => {
    const dir = await project({
      projectType: 'application',
      project: process.env.PROJECT,
      testRunner: false,
      linter: false
    });

    t.truthy(dir);
    assert.file(join(dir, 'package.json'));
    assert.file(join(dir, '.neutrinorc.js'));

    await buildable(t, dir);
  });
}
