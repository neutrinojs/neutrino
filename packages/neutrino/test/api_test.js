import test from 'ava';
import { Neutrino } from '../src';
import { join } from 'path';

test('initializes with no arguments', t => {
  t.notThrows(() => Neutrino());
});

test('initializes with options', t => {
  t.notThrows(() => Neutrino({ testing: true }));
});

test('initialization stores options', t => {
  const options = { alpha: 'a', beta: 'b', gamma: 'c' };
  const api = Neutrino(options);

  t.is(api.options.alpha, options.alpha);
  t.is(api.options.beta, options.beta);
  t.is(api.options.gamma, options.gamma);
});

test('options.root', t => {
  const api = Neutrino();

  t.is(api.options.root, process.cwd());
  api.options.root = './alpha';
  t.is(api.options.root, join(process.cwd(), 'alpha'));
  api.options.root = '/alpha';
  t.is(api.options.root, '/alpha');
});

test('options.source', t => {
  const api = Neutrino();

  t.is(api.options.source, join(process.cwd(), 'src'));
  api.options.source = './alpha';
  t.is(api.options.source, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.source, join('/beta', 'alpha'));
  api.options.source = '/alpha';
  t.is(api.options.source, '/alpha');
});

test('options.output', t => {
  const api = Neutrino();

  t.is(api.options.output, join(process.cwd(), 'build'));
  api.options.output = './alpha';
  t.is(api.options.output, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.output, join('/beta', 'alpha'));
  api.options.output = '/alpha';
  t.is(api.options.output, '/alpha');
});

test('options.tests', t => {
  const api = Neutrino();

  t.is(api.options.tests, join(process.cwd(), 'test'));
  api.options.tests = './alpha';
  t.is(api.options.tests, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.tests, join('/beta', 'alpha'));
  api.options.tests = '/alpha';
  t.is(api.options.tests, '/alpha');
});

test('options.node_modules', t => {
  const api = Neutrino();

  t.is(api.options.node_modules, join(process.cwd(), 'node_modules'));
  api.options.node_modules = './alpha';
  t.is(api.options.node_modules, join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  t.is(api.options.node_modules, join('/beta', 'alpha'));
  api.options.node_modules = '/alpha';
  t.is(api.options.node_modules, '/alpha');
});

test('options.entry', t => {
  const api = Neutrino();

  t.is(api.options.entry, join(process.cwd(), 'src/index'));
  api.options.entry = './alpha.js';
  t.is(api.options.entry, join(process.cwd(), 'src/alpha.js'));
  api.options.source = 'beta';
  t.is(api.options.entry, join(process.cwd(), 'beta/alpha.js'));
  api.options.root = '/gamma';
  t.is(api.options.entry, join('/gamma', 'beta/alpha.js'));
  api.options.entry = '/alpha.js';
  t.is(api.options.entry, '/alpha.js');
});

test('creates an instance of webpack-chain', t => {
  const api = Neutrino();

  t.is(typeof api.config.toConfig, 'function');
});

test('middleware receives API instance', t => {
  const api = Neutrino();

  api.use(n => t.is(n, api));
});

test('middleware receives default options', t => {
  const api = Neutrino();

  api.use((api, options) => {
    t.deepEqual(options, {});
  });
});

test('middleware receives options parameter', t => {
  const api = Neutrino();
  const defaults = { alpha: 'a', beta: 'b', gamma: 'c' };

  api.use((api, options) => {
    t.deepEqual(options, defaults);
  }, defaults);
});

test('triggers promisified event handlers', t => {
  const api = Neutrino();

  api.on('test', () => t.pass('test event triggered'));
  api.emitForAll('test');
});

test('events handle promise resolution', async t => {
  const api = Neutrino();

  api.on('test', () => Promise.resolve('alpha'));

  const [value] = await api.emitForAll('test');

  t.is(value, 'alpha');
});

test('events handle promise rejection', async t => {
  const api = Neutrino();

  api.on('test', () => Promise.reject(new Error('beta')));

  const err = await t.throws(api.emitForAll('test'));

  t.is(err.message, 'beta');
});

test('events handle multiple promise resolutions', async t => {
  const api = Neutrino();

  api.on('test', () => Promise.resolve('alpha'));
  api.on('test', () => Promise.resolve('beta'));
  api.on('test', () => Promise.resolve('gamma'));

  const values = await api.emitForAll('test');

  t.deepEqual(values, ['alpha', 'beta', 'gamma']);
});

test('import middleware for use', async (t) => {
  const api = Neutrino({ root: __dirname });

  await api.requiresAndUses(['fixtures/middleware']).promise();
  t.notDeepEqual(api.config.toConfig(), {});
});

test('command emits events around execution', async (t) => {
  const api = Neutrino();
  const events = [];

  api.on('prebuild', () => events.push('alpha'));
  api.on('build', () => events.push('beta'));

  await api.emitForAll('prebuild');
  await api.emitForAll('build');

  t.deepEqual(events, ['alpha', 'beta']);
});

test('creates a Webpack config', t => {
  const api = Neutrino();

  api.use(api => api.config.module
    .rule('compile')
    .test(/\.js$/));

  t.notDeepEqual(api.config.toConfig(), {});
});
