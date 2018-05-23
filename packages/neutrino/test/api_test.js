import test from 'ava';
import { join } from 'path';
import Neutrino from '../Neutrino';

test('initializes with no arguments', t => {
  t.notThrows(() => new Neutrino());
});

test('initializes with options', t => {
  t.notThrows(() => new Neutrino({ testing: true }));
});

test('initialization stores options', t => {
  const options = { alpha: 'a', beta: 'b', gamma: 'c' };
  const api = new Neutrino(options);

  t.is(api.options.alpha, options.alpha);
  t.is(api.options.beta, options.beta);
  t.is(api.options.gamma, options.gamma);
});

test('merges custom primitive option properties', t => {
  const options = { alpha: 'a', beta: {}, gamma: 4, delta: [] };
  const api = new Neutrino(options);

  api.options = api.mergeOptions(api.options, { alpha: 'd', beta: 3, gamma: /.*/, delta: true });

  t.is(api.options.alpha, 'd');
  t.is(api.options.beta, 3);
  t.deepEqual(api.options.gamma, /.*/);
  t.is(api.options.delta, true);
});

test('options.root', t => {
  const api = new Neutrino();

  t.is(api.options.root, process.cwd());
  api.options.root = './alpha';
  t.is(api.options.root, join(process.cwd(), 'alpha'));
  api.options.root = '/alpha';
  t.is(api.options.root, '/alpha');
});

test('options.source', t => {
  const api = new Neutrino();

  t.is(api.options.source, join(process.cwd(), 'src'));
  api.options.source = './alpha';
  t.is(api.options.source, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.source, join('/beta', 'alpha'));
  api.options.source = '/alpha';
  t.is(api.options.source, '/alpha');
});

test('options.output', t => {
  const api = new Neutrino();

  t.is(api.options.output, join(process.cwd(), 'build'));
  api.options.output = './alpha';
  t.is(api.options.output, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.output, join('/beta', 'alpha'));
  api.options.output = '/alpha';
  t.is(api.options.output, '/alpha');
});

test('options.tests', t => {
  const api = new Neutrino();

  t.is(api.options.tests, join(process.cwd(), 'test'));
  api.options.tests = './alpha';
  t.is(api.options.tests, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.tests, join('/beta', 'alpha'));
  api.options.tests = '/alpha';
  t.is(api.options.tests, '/alpha');
});

test('options.node_modules', t => {
  const api = new Neutrino();

  t.is(api.options.node_modules, join(process.cwd(), 'node_modules'));
  api.options.node_modules = './alpha';
  t.is(api.options.node_modules, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.node_modules, join('/beta', 'alpha'));
  api.options.node_modules = '/alpha';
  t.is(api.options.node_modules, '/alpha');
});

test('options.mains', t => {
  const api = new Neutrino();

  t.is(api.options.mains.index, join(process.cwd(), 'src/index'));
  api.options.mains.index = './alpha.js';
  t.is(api.options.mains.index, join(process.cwd(), 'src/alpha.js'));
  api.options.source = 'beta';
  t.is(api.options.mains.index, join(process.cwd(), 'beta/alpha.js'));
  api.options.root = '/gamma';
  t.is(api.options.mains.index, join('/gamma', 'beta/alpha.js'));
  api.options.mains.index = '/alpha.js';
  t.is(api.options.mains.index, '/alpha.js');
});

test('override options.mains', t => {
  const api = new Neutrino({
    mains: {
      alpha: 'beta',
      gamma: 'delta'
    }
  });

  t.is(api.options.mains.alpha, join(process.cwd(), 'src/beta'));
  api.options.mains.alpha = './alpha.js';
  t.is(api.options.mains.alpha, join(process.cwd(), 'src/alpha.js'));
  api.options.source = 'epsilon';
  t.is(api.options.mains.alpha, join(process.cwd(), 'epsilon/alpha.js'));
  api.options.root = '/zeta';
  t.is(api.options.mains.alpha, join('/zeta', 'epsilon/alpha.js'));
  api.options.mains.alpha = '/alpha.js';
  t.is(api.options.mains.alpha, '/alpha.js');

  t.is(api.options.mains.gamma, join('/zeta', 'epsilon/delta'));
  api.options.mains.gamma = './alpha.js';
  t.is(api.options.mains.gamma, join('/zeta', 'epsilon/alpha.js'));
  api.options.source = 'src';
  t.is(api.options.mains.gamma, join('/zeta', 'src/alpha.js'));
  api.options.root = process.cwd();
  t.is(api.options.mains.gamma, join(process.cwd(), 'src/alpha.js'));
  api.options.mains.gamma = '/alpha.js';
  t.is(api.options.mains.gamma, '/alpha.js');
});

test('creates an instance of webpack-chain', t => {
  t.is(typeof new Neutrino().config.toConfig, 'function');
});

test('middleware receives API instance', t => {
  const api = new Neutrino();

  api.use(n => t.is(n, api));
});

test('middleware receives no default options', t => {
  const api = new Neutrino();

  api.use((api, options) => {
    t.is(options, undefined);
  });
});

test('middleware receives options parameter', t => {
  const api = new Neutrino();
  const defaults = { alpha: 'a', beta: 'b', gamma: 'c' };

  api.use((api, options) => {
    t.deepEqual(options, defaults);
  }, defaults);
});

test('import middleware for use', async (t) => {
  const api = new Neutrino({ root: __dirname });

  api.use(['fixtures/middleware']);
  t.notDeepEqual(api.config.toConfig(), {});
});

test('creates a webpack config', t => {
  const api = new Neutrino();

  api.use(api => {
    api.config.module
      .rule('compile')
      .test(api.regexFromExtensions(['js']))
  });

  t.notDeepEqual(api.config.toConfig(), {});
});

test('regexFromExtensions', t => {
  const api = new Neutrino();

  t.is(String(api.regexFromExtensions(['js'])), '/\\.js$/');
  t.is(String(api.regexFromExtensions(['js', 'css'])), '/\\.(js|css)$/');
  t.is(String(api.regexFromExtensions(['worker.js', 'worker.jsx'])), '/\\.(worker\\.js|worker\\.jsx)$/');
});
