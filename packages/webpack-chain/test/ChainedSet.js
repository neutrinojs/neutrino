import test from 'ava';
import ChainedSet from '../src/ChainedSet';

test('is Chainable', t => {
  const parent = { parent: true };
  const set = new ChainedSet(parent);

  t.is(set.end(), parent);
});

test('creates a backing Set', t => {
  const set = new ChainedSet();

  t.true(set.store instanceof Set);
});

test('add', t => {
  const set = new ChainedSet();

  t.is(set.add('alpha'), set);
  t.true(set.store.has('alpha'));
  t.is(set.store.size, 1);
});

test('prepend', t => {
  const set = new ChainedSet();

  set.add('alpha');

  t.is(set.prepend('beta'), set);
  t.true(set.store.has('beta'));
  t.deepEqual([...set.store], ['beta', 'alpha']);
});

test('clear', t => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  t.is(set.store.size, 3);
  t.is(set.clear(), set);
  t.is(set.store.size, 0);
});

test('delete', t => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  t.is(set.delete('beta'), set);
  t.is(set.store.size, 2);
  t.false(set.store.has('beta'));
});

test('has', t => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  t.true(set.has('beta'));
  t.false(set.has('delta'));
  t.is(set.has('beta'), set.store.has('beta'));
});

test('values', t => {
  const set = new ChainedSet();

  set.add('alpha');
  set.add('beta');
  set.add('gamma');

  t.deepEqual(set.values(), ['alpha', 'beta', 'gamma']);
});

test('merge with no values', t => {
  const set = new ChainedSet();
  const arr = ['alpha', 'beta', 'gamma'];

  t.is(set.merge(arr), set);
  t.deepEqual(set.values(), arr);
});

test('merge with existing values', t => {
  const set = new ChainedSet();
  const arr = ['alpha', 'beta', 'gamma'];

  set.add('delta');

  t.is(set.merge(arr), set);
  t.deepEqual(set.values(), ['delta', 'alpha', 'beta', 'gamma']);
});
