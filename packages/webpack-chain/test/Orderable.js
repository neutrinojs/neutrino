import test from 'ava';
import Orderable from '../src/Orderable';
import ChainedMap from '../src/ChainedMap';

const Ordered = Orderable(class Test extends ChainedMap {});

test('before', t => {
  const ordered = new Ordered();
  const instance = ordered
    .set('gamma')
    .before('beta');

  t.is(instance, ordered);
  t.is(ordered.__before, 'beta');
});

test('after', t => {
  const ordered = new Ordered();
  const instance = ordered
    .set('gamma')
    .after('alpha');

  t.is(instance, ordered);
  t.is(ordered.__after, 'alpha');
});

test('before throws with after', t => {
  const ordered = new Ordered();

  t.throws(() => ordered.after('alpha').before('beta'));
});

test('after throws with before', t => {
  const ordered = new Ordered();

  t.throws(() => ordered.before('beta').after('alpha'));
});

test('ordering before', t => {
  const map = new ChainedMap();

  map.set('beta', new Ordered().set('beta', 'beta'));
  map.set('alpha', new Ordered().set('alpha', 'alpha').before('beta'));

  t.deepEqual(map.values().map(o => o.values()), [['alpha'], ['beta']]);
});

test('ordering after', t => {
  const map = new ChainedMap();

  map.set('beta', new Ordered().set('beta', 'beta').after('alpha'));
  map.set('alpha', new Ordered().set('alpha', 'alpha'));

  t.deepEqual(map.values().map(o => o.values()), [['alpha'], ['beta']]);
});

test('ordering before and after', t => {
  const map = new ChainedMap();

  map.set('beta', new Ordered().set('beta', 'beta'));
  map.set('gamma', new Ordered().set('gamma', 'gamma').after('beta'));
  map.set('alpha', new Ordered().set('alpha', 'alpha').before('beta'));

  t.deepEqual(map.values().map(o => o.values()), [['alpha'], ['beta'], ['gamma']]);
});

test('merge with before', t => {
  const ordered = new Ordered();
  const instance = ordered
    .set('gamma')
    .merge({
      before: 'beta'
    });

  t.is(instance, ordered);
  t.is(ordered.__before, 'beta');
});

test('merge with after', t => {
  const ordered = new Ordered();
  const instance = ordered
    .set('gamma')
    .merge({
      after: 'alpha'
    });

  t.is(instance, ordered);
  t.is(ordered.__after, 'alpha');
});

test('merging throws using before with after', t => {
  t.throws(() => new Ordered().merge({ before: 'beta', after: 'alpha' }));
});
