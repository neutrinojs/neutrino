import test from 'ava';
import ChainedMap from '../src/ChainedMap';

test('is Chainable', t => {
  const parent = { parent: true };
  const map = new ChainedMap(parent);

  t.is(map.end(), parent);
});

test('creates a backing Map', t => {
  const map = new ChainedMap();

  t.true(map.store instanceof Map);
});

test('set', t => {
  const map = new ChainedMap();

  t.is(map.set('a', 'alpha'), map);
  t.is(map.store.get('a'), 'alpha');
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

  t.is(map.store.size, 3);
  t.is(map.clear(), map);
  t.is(map.store.size, 0);
});

test('delete', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.is(map.delete('b'), map);
  t.is(map.store.size, 2);
  t.false(map.store.has('b'));
});

test('has', t => {
  const map = new ChainedMap();

  map.set('a', 'alpha');
  map.set('b', 'beta');
  map.set('c', 'gamma');

  t.true(map.has('b'));
  t.false(map.has('d'));
  t.is(map.has('b'), map.store.has('b'));
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

test('merge with omitting keys', t => {
  const map = new ChainedMap();
  const obj = { a: 'alpha', b: 'beta', c: 'gamma'};

  map.merge(obj, ['b']);

  t.deepEqual(map.entries(), { a: 'alpha', c: 'gamma' });
});

test('when true', t => {
  const map = new ChainedMap();
  const right = instance => {
    t.is(instance, map);
    instance.set('alpha', 'a');
  };
  const left = instance => {
    instance.set('beta', 'b');
  };

  t.is(map.when(true, right, left), map);
  t.true(map.has('alpha'));
  t.false(map.has('beta'));
});

test('when false', t => {
  const map = new ChainedMap();
  const right = instance => {
    instance.set('alpha', 'a');
  };
  const left = instance => {
    t.is(instance, map);
    instance.set('beta', 'b');
  };

  t.is(map.when(false, right, left), map);
  t.false(map.has('alpha'));
  t.true(map.has('beta'));
});
