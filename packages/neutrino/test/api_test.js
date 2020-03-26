import test from 'ava';
import { join } from 'path';
import Neutrino from '../Neutrino';

test('initializes with no arguments', (t) => {
  t.notThrows(() => new Neutrino());
});

test('initializes with options', (t) => {
  t.notThrows(() => new Neutrino({ testing: true }));
});

test('initialization stores options', (t) => {
  const options = { alpha: 'a', beta: 'b', gamma: 'c' };
  const api = new Neutrino(options);

  t.is(api.options.alpha, options.alpha);
  t.is(api.options.beta, options.beta);
  t.is(api.options.gamma, options.gamma);
});

test('options.root', (t) => {
  const api = new Neutrino();

  t.is(api.options.root, process.cwd());
  api.options.root = './alpha';
  t.is(api.options.root, join(process.cwd(), 'alpha'));
  api.options.root = '/alpha';
  t.is(api.options.root, '/alpha');
});

test('options.source', (t) => {
  const api = new Neutrino();

  t.is(api.options.source, join(process.cwd(), 'src'));
  api.options.source = './alpha';
  t.is(api.options.source, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.source, join('/beta', 'alpha'));
  api.options.source = '/alpha';
  t.is(api.options.source, '/alpha');
});

test('options.output', (t) => {
  const api = new Neutrino();

  t.is(api.options.output, join(process.cwd(), 'build'));
  api.options.output = './alpha';
  t.is(api.options.output, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.output, join('/beta', 'alpha'));
  api.options.output = '/alpha';
  t.is(api.options.output, '/alpha');
});

test('options.tests', (t) => {
  const api = new Neutrino();

  t.is(api.options.tests, join(process.cwd(), 'test'));
  api.options.tests = './alpha';
  t.is(api.options.tests, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.tests, join('/beta', 'alpha'));
  api.options.tests = '/alpha';
  t.is(api.options.tests, '/alpha');
});

test('throws when legacy options.node_modules is set', (t) => {
  t.throws(
    () => new Neutrino({ node_modules: 'abc' }),
    /options\.node_modules has been removed/,
  );
});

test('throws when legacy options.host is set', (t) => {
  t.throws(
    () => new Neutrino({ host: 'abc' }),
    /options\.host has been removed/,
  );
});

test('throws when legacy options.port is set', (t) => {
  t.throws(
    () => new Neutrino({ port: 1234 }),
    /options\.port has been removed/,
  );
});

test('options.mains', (t) => {
  const api = new Neutrino();

  t.deepEqual(api.options.mains.index, {
    entry: join(process.cwd(), 'src/index'),
  });
  api.options.mains.index = './alpha.js';
  t.deepEqual(api.options.mains.index, {
    entry: join(process.cwd(), 'src/alpha.js'),
  });
  api.options.source = 'beta';
  t.deepEqual(api.options.mains.index, {
    entry: join(process.cwd(), 'beta/alpha.js'),
  });
  api.options.root = '/gamma';
  t.deepEqual(api.options.mains.index, {
    entry: join('/gamma', 'beta/alpha.js'),
  });
  api.options.mains.index = '/alpha.js';
  t.deepEqual(api.options.mains.index, { entry: '/alpha.js' });
});

test('override options.mains', (t) => {
  const api = new Neutrino({
    mains: {
      alpha: 'beta',
      gamma: {
        entry: 'delta',
        title: 'Gamma Page',
      },
    },
  });

  t.deepEqual(api.options.mains.alpha, {
    entry: join(process.cwd(), 'src/beta'),
  });
  api.options.mains.alpha = { entry: './alpha.js', minify: false };
  t.deepEqual(api.options.mains.alpha, {
    entry: join(process.cwd(), 'src/alpha.js'),
    minify: false,
  });
  api.options.source = 'epsilon';
  t.deepEqual(api.options.mains.alpha, {
    entry: join(process.cwd(), 'epsilon/alpha.js'),
    minify: false,
  });
  api.options.root = '/zeta';
  t.deepEqual(api.options.mains.alpha, {
    entry: join('/zeta', 'epsilon/alpha.js'),
    minify: false,
  });
  api.options.mains.alpha = '/alpha.js';
  t.deepEqual(api.options.mains.alpha, { entry: '/alpha.js' });

  t.deepEqual(api.options.mains.gamma, {
    entry: join('/zeta', 'epsilon/delta'),
    title: 'Gamma Page',
  });
  api.options.mains.gamma = './alpha.js';
  t.deepEqual(api.options.mains.gamma, {
    entry: join('/zeta', 'epsilon/alpha.js'),
  });
  api.options.source = 'src';
  t.deepEqual(api.options.mains.gamma, {
    entry: join('/zeta', 'src/alpha.js'),
  });
  api.options.root = process.cwd();
  t.deepEqual(api.options.mains.gamma, {
    entry: join(process.cwd(), 'src/alpha.js'),
  });
  api.options.mains.gamma = '/alpha.js';
  t.deepEqual(api.options.mains.gamma, { entry: '/alpha.js' });
});

test('override options.mains.index template', (t) => {
  const api = new Neutrino({
    mains: {
      index: {
        template: 'alpha.eps',
      },
    },
  });

  t.deepEqual(api.options.mains.index, {
    entry: join(process.cwd(), 'src/index'),
    template: 'alpha.eps',
  });
});

test('creates an instance of webpack-chain', (t) => {
  t.is(typeof new Neutrino().config.toConfig, 'function');
});

test('middleware receives API instance', (t) => {
  const api = new Neutrino();

  api.use((n) => t.is(n, api));
});

test('middleware fails on more than one argument', (t) => {
  const api = new Neutrino();
  const errorMatch = /middleware only accepts a single argument/;

  /* eslint-disable no-unused-vars */
  t.notThrows(() => api.use(function good() {}));
  t.notThrows(() => api.use(function good(neutrino) {}));
  t.throws(() => api.use(function bad(neutrino, options) {}), errorMatch);
  /* eslint-enable no-unused-vars */
});

test('middleware only accepts functions', (t) => {
  const api = new Neutrino();
  const errorMatch = /middleware can only be passed as functions/;

  t.notThrows(() => api.use(function good() {}));
  t.throws(() => api.use('bad'), errorMatch);
  t.throws(() => api.use(['bad', { alpha: 'beta' }]), errorMatch);
  t.throws(() => api.use({ alpha: 'beta' }), errorMatch);
});

test('creates a webpack config', (t) => {
  const api = new Neutrino();

  api.use((api) => {
    api.config.module.rule('compile').test(api.regexFromExtensions(['js']));
  });

  t.notDeepEqual(api.config.toConfig(), {});
});

test('regexFromExtensions', (t) => {
  const api = new Neutrino();

  t.is(String(api.regexFromExtensions()), '/\\.(mjs|jsx|js)$/');
  t.is(String(api.regexFromExtensions(['js'])), '/\\.js$/');
  t.is(String(api.regexFromExtensions(['js', 'css'])), '/\\.(js|css)$/');
  t.is(
    String(api.regexFromExtensions(['worker.js', 'worker.jsx'])),
    '/\\.(worker\\.js|worker\\.jsx)$/',
  );
});

test('getDependencyVersion', (t) => {
  const api = new Neutrino();

  api.options.packageJson = {
    devDependencies: {
      neutrino: '^9',
    },
    dependencies: {
      'core-js': '^3',
    },
  };

  t.is(api.getDependencyVersion('neutrino').major, 9);
  t.is(api.getDependencyVersion('core-js').major, 3);
  t.is(api.getDependencyVersion('eslint'), false);
});

test('extensions option overrides defaults', (t) => {
  const extensions = ['ts'];
  const api = new Neutrino({ extensions });

  t.deepEqual(api.options.extensions, extensions);
});
