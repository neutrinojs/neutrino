import test from 'ava';
import { xprod } from 'ramda';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import { join } from 'path';
import { spawn } from 'child_process';
import { packages } from '../commands/init/utils'

if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'test';
}

const project = (prompts) => helpers
  .run(require.resolve(join(__dirname, '../commands/init')))
  .inTmpDir(function(dir) {
    this.withOptions({ directory: dir, name: 'testable', stdio: 'ignore' });
  })
  .withPrompts(prompts)
  .toPromise();
const usable = (dir, files) => assert.file(files.map(f => join(dir, f)));
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
const tests = [packages.JEST, packages.KARMA, packages.MOCHA];
const matrix = {
  react: [
    [packages.REACT],
    [packages.AIRBNB, packages.STANDARDJS],
    tests
  ],
  preact: [
    [packages.PREACT],
    [packages.AIRBNB, packages.STANDARDJS],
    tests
  ],
  node: [
    [packages.NODE],
    [packages.AIRBNB_BASE, packages.STANDARDJS],
    tests.filter(t => t !== packages.KARMA)
  ],
  'react-components': [
    [packages.REACT_COMPONENTS],
    [packages.AIRBNB, packages.STANDARDJS],
    tests
  ],
  vue: [
    [packages.VUE],
    [packages.AIRBNB_BASE, packages.STANDARDJS],
    tests
  ],
  web: [
    [packages.WEB],
    [packages.AIRBNB_BASE, packages.STANDARDJS],
    tests
  ],
};

Object
  .keys(matrix)
  .forEach((key) => {
    const [presets, linters, tests] = matrix[key];
    const [preset] = presets;

    test.serial(preset, async t => {
      const dir = await project({
        projectType: 'application',
        project: preset,
        testRunner: false,
        linter: false
      });

      usable(dir, [
        'package.json',
        '.neutrinorc.js'
      ]);

      await buildable(t, dir);
    });

    xprod(presets, tests).forEach(([preset, testRunner]) => {
      const testName = testRunner ? `${preset} + ${testRunner}` : preset;

      test.serial(testName, async t => {
        const dir = await project({
          projectType: 'application',
          project: preset,
          testRunner,
          linter: false
        });

        usable(dir, [
          'package.json',
          '.neutrinorc.js',
          'test/simple_test.js'
        ]);

        await Promise.all([
          buildable(t, dir),
          testable(t, dir)
        ]);
      });
    });

    xprod(presets, linters).forEach(([preset, linter]) => {
      const testName = `${preset} + ${linter}`;

      test.serial(testName, async t => {
        const dir = await project({
          projectType: 'application',
          project: preset,
          testRunner: false,
          linter
        });

        usable(dir, [
          'package.json',
          '.neutrinorc.js',
          '.eslintrc.js'
        ]);

        await Promise.all([
          buildable(t, dir),
          lintable(t, dir)
        ]);
      });
    });
  });
