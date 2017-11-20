import test from 'ava';
import Output from '../src/Output';

test('is Chainable', t => {
  const parent = { parent: true };
  const output = new Output(parent);

  t.is(output.end(), parent);
});

test('shorthand methods', t => {
  const output = new Output();
  const obj = {};

  output.shorthands.map(method => {
    obj[method] = 'alpha';
    t.is(output[method]('alpha'), output);
  });

  t.deepEqual(output.entries(), obj);
});
