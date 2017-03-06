import test from 'ava';
import Loader from '../src/Loader';

test('tap', t => {
  const loader = new Loader('babel-loader', { presets: ['alpha'] });

  loader.tap(options => {
    t.deepEqual(options, { presets: ['alpha'] });
    return { presets: ['beta'] };
  });

  t.deepEqual(loader.options, { presets: ['beta'] });
});
