import test from 'ava';
import { xprod } from 'ramda';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import { join } from 'path';
import { spawn } from 'child_process';

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
  spawn(cmd, args, options)
    .on('close', (code) => {
      code === 0 ? resolve(code) : reject(code);
    });
});
const buildable = async (t, dir) => {
  try {
    await spawnP('yarn', ['build'], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (code) {
    t.fail('Failed to build project');
  }
};
const testable = async (t, dir) => {
  try {
    await spawnP('yarn', ['test'], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (code) {
    t.fail('Failed to test project');
  }
};
const lintable = async (t, dir) => {
  try {
    await spawnP('yarn', ['lint'], { cwd: dir, stdio: 'pipe' });
    t.pass();
  } catch (code) {
    t.fail('Failed to lint project');
  }
};
const tests = [false, '@neutrinojs/jest', '@neutrinojs/karma', '@neutrinojs/mocha'];
const matrix = {
  react: [
    ['@neutrinojs/react'],
    ['@neutrinojs/airbnb', '@neutrinojs/standardjs'],
    tests
  ],
  preact: [
    ['@neutrinojs/preact'],
    ['@neutrinojs/airbnb', '@neutrinojs/standardjs'],
    tests
  ],
  node: [
    ['@neutrinojs/node'],
    ['@neutrinojs/airbnb-base', '@neutrinojs/standardjs'],
    tests.filter(t => t !== '@neutrinojs/karma')
  ],
  'react-components': [
    ['@neutrinojs/react-components'],
    ['@neutrinojs/airbnb', '@neutrinojs/standardjs'],
    tests
  ],
  vue: [
    ['@neutrinojs/vue'],
    ['@neutrinojs/airbnb-base', '@neutrinojs/standardjs'],
    tests
  ],
  web: [
    ['@neutrinojs/web'],
    ['@neutrinojs/airbnb-base', '@neutrinojs/standardjs'],
    tests
  ],
};

Object
  .keys(matrix)
  .forEach((key) => {
    const [presets, linters, tests] = matrix[key];

    xprod(presets, tests).forEach(([preset, testRunner]) => {
      const testName = testRunner ? `${preset} + ${testRunner}` : preset;

      test(testName, async t => {
        const dir = await project({
          projectType: 'application',
          project: preset,
          testRunner,
          linter: false
        });

        if (testRunner) {
          usable(dir, [
            'package.json',
            '.neutrinorc.js',
            'test/simple_test.js'
          ]);

          await Promise.all([
            buildable(t, dir),
            testable(t, dir)
          ]);
        } else {
          usable(dir, [
            'package.json',
            '.neutrinorc.js'
          ]);

          await buildable(t, dir);
        }
      });
    });

    xprod(presets, linters).forEach(([preset, linter]) => {
      test(`${preset} + ${linter}`, async t => {
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
