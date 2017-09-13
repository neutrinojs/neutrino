import test from 'ava';
import DevServer from '../src/DevServer';

test('is Chainable', t => {
  const parent = { parent: true };
  const devServer = new DevServer(parent);

  t.is(devServer.end(), parent);
});

test('sets allowed hosts', t => {
  const devServer = new DevServer();
  const instance = devServer.allowedHosts.add('https://github.com').end();

  t.is(instance, devServer);
  t.deepEqual(devServer.toConfig(), { allowedHosts: ['https://github.com'] });
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

