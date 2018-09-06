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
  .inTmpDir(function setOptions(dir) {
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

  child.stdout.on('data', data => { output += data.toString(); });
  child.stderr.on('data', data => { output += data.toString(); });
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

Object.keys(tests).forEach(projectName => {
  const { linter, tester } = tests[projectName];
  let projectType;
  if (projectName.includes('library')) {
    projectType = 'library';
  } else if (projectName.includes('components')) {
    projectType = 'components';
  } else {
    projectType = 'application';
  }
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
    const pkgPath = join(dir, 'package.json');

    t.truthy(dir);
    assert.file(pkgPath);
    assert.file(join(dir, '.neutrinorc.js'));
    assert.file(join(dir, 'webpack.config.js'));
    assert.file(join(dir, '.eslintrc.js'));

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

    if (tester) {
      if (tester === packages.JEST) {
        assert.file(join(dir, 'jest.config.js'));
      } else if (tester === packages.KARMA) {
        assert.file(join(dir, 'karma.conf.js'));
      } else if (tester === packages.MOCHA) {
        assert.file(join(dir, 'mocha.config.js'));
      }

      assert.file(join(dir, 'test/simple_test.js'));
      await testable(t, dir);
    }
  });
});
