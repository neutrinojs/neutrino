import test from 'ava';
import Chainable from '../src/Chainable';

test('Calling .end() returns parent', t => {
  const parent = { parent: true };
  const chain = new Chainable(parent);

  t.is(chain.end(), parent);
});
