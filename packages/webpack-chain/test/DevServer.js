import test from 'ava';
import DevServer from '../src/DevServer';

test('is Chainable', t => {
  const parent = { parent: true };
  const devServer = new DevServer(parent);

  t.is(devServer.end(), parent);
});

test('shorthand methods', t => {
  const devServer = new DevServer();
  const obj = {};

  devServer.shorthands.map(method => {
    obj[method] = 'alpha';
    t.is(devServer[method]('alpha'), devServer);
  });

  t.deepEqual(devServer.entries(), obj);
});

