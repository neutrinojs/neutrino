import test from 'ava';
import ResolveLoader from '../src/ResolveLoader';

test('is Chainable', t => {
  const parent = { parent: true };
  const resolveLoader = new ResolveLoader(parent);

  t.is(resolveLoader.end(), parent);
});

test('sets methods', t => {
  const resolveLoader = new ResolveLoader();
  const instance = resolveLoader.modules.add('src').end();

  t.is(instance, resolveLoader);
});

test('toConfig empty', t => {
  const resolveLoader = new ResolveLoader();

  t.deepEqual(resolveLoader.toConfig(), {});
});

test('toConfig with values', t => {
  const resolveLoader = new ResolveLoader();

  resolveLoader
    .modules.add('src').end()
    .set('moduleExtensions', ['-loader']);

  t.deepEqual(resolveLoader.toConfig(), {
    modules: ['src'],
    moduleExtensions: ['-loader']
  });
});

test('merge empty', t => {
  const resolveLoader = new ResolveLoader();
  const obj = {
    modules: ['src'],
    moduleExtensions: ['-loader']
  };
  const instance = resolveLoader.merge(obj);

  t.is(instance, resolveLoader);
  t.deepEqual(resolveLoader.toConfig(), obj);
});

test('merge with values', t => {
  const resolveLoader = new ResolveLoader();

  resolveLoader
    .modules.add('src').end()
    .moduleExtensions.add('-loader');

  resolveLoader.merge({
    modules: ['dist'],
    moduleExtensions: ['-fake']
  });

  t.deepEqual(resolveLoader.toConfig(), {
    modules: ['src', 'dist'],
    moduleExtensions: ['-loader', '-fake']
  });
});
