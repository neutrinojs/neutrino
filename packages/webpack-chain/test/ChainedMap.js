import test from 'ava';
import ChainedMap from '../src/ChainedMap';

test('is Chainable', t => {
  const parent = { parent: true };
  const map = new ChainedMap(parent);

  t.is(map.end(), parent);
});

test('creates a backing Map', t => {
  const map = new ChainedMap();

  t.true(map.options instanceof Map);
});

test('set', t => {
  const map = new ChainedMap();

  t.is(map.set('a', 'alpha'), map);
  t.is(map.options.get('a'), 'alpha');
});

test('get', t => {
  const map = new ChainedMap();

  t.is(map.set('a', 'alpha'), map);
  t.is(map.get('a'), 'alpha');
});

test('clear', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.is(map.options.size, 3);
  t.is(map.clear(), map);
  t.is(map.options.size, 0);
});

test('delete', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.is(map.delete('b'), map);
  t.is(map.options.size, 2);
  t.false(map.options.has('b'));
});

test('has', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.true(map.has('b'));
  t.false(map.has('d'));
  t.is(map.has('b'), map.options.has('b'));
});

test('values', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.deepEqual(map.values(), ['alpha', 'beta', 'gamma']);
});

test('entries with values', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.deepEqual(map.entries(), { a: 'alpha', b: 'beta', c: 'gamma'});
});

test('entries with no values', t => {
  const map = new ChainedMap();

  t.is(map.entries(), undefined);
});

test('merge with no values', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma'};

  t.is(map.merge(obj), map);
  t.deepEqual(map.entries(), obj);
});

test('merge with existing values', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma'};

  map.set('d', 'delta');

  t.is(map.merge(obj), map);
  t.deepEqual(map.entries(), { a: 'alpha', b: 'beta', c: 'gamma', d: 'delta' });
});

test('merge with overriding values', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma'};

  map.set('b', 'delta');

  t.is(map.merge(obj), map);
  t.deepEqual(map.entries(), { a: 'alpha', b: 'beta', c: 'gamma' });
});
