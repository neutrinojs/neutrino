import test from 'ava';
import { xprod } from 'ramda';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import { join } from 'path';
import { spawnSync } from 'child_process';

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
const buildable = (dir) => spawnSync('yarn', ['build'], { cwd: dir, stdio: 'pipe' });
const testable = (dir) => spawnSync('yarn', ['test'], { cwd: dir, stdio: 'pipe' });
const lintable = (dir) => spawnSync('yarn', ['lint'], { cwd: dir, stdio: 'pipe' });
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
    tests
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

          const built = buildable(dir);
          t.is(built.status, 0, 'Building project failed');

          const tested = testable(dir);
          t.is(tested.status, 0, 'Testing project failed');
        } else {
          usable(dir, [
            'package.json',
            '.neutrinorc.js'
          ]);

          const built = buildable(dir);
          t.is(built.status, 0, 'Building project failed');
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

        const built = buildable(dir);
        t.is(built.status, 0, 'Building project failed');

        const linted = lintable(dir);
        t.is(linted.status, 0, 'Linting project failed');
      });
    });
  });
