import test from 'ava';
import Plugin from '../src/Plugin';

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

test('is Chainable', t => {
  const parent = { parent: true };
  const plugin = new Plugin(parent);

  t.is(plugin.end(), parent);
});

test('use', t => {
  const plugin = new Plugin();
  const instance = plugin.use(StringifyPlugin, ['alpha', 'beta']);

  t.is(instance, plugin);
  t.is(plugin.get('plugin'), StringifyPlugin);
  t.deepEqual(plugin.get('args'), ['alpha', 'beta']);
});

test('tap', t => {
  const plugin = new Plugin();

  plugin.use(StringifyPlugin, ['alpha', 'beta']);

  const instance = plugin.tap(args => ['gamma', 'delta']);

  t.is(instance, plugin);
  t.deepEqual(plugin.get('args'), ['gamma', 'delta']);
});

test('init', t => {
  const plugin = new Plugin();

  plugin.use(StringifyPlugin);

  const instance = plugin.init((Plugin, args) => {
    t.deepEqual(args, []);
    return new Plugin('gamma', 'delta');
  });
  const initialized = plugin.get('init')(plugin.get('plugin'), plugin.get('args'));

  t.is(instance, plugin);
  t.true(initialized instanceof StringifyPlugin);
  t.deepEqual(initialized.values, ['gamma', 'delta']);
});

test('toConfig', t => {
  const plugin = new Plugin();

  plugin.use(StringifyPlugin);

  const initialized = plugin.toConfig();

  t.true(initialized instanceof StringifyPlugin);
  t.deepEqual(initialized.values, []);
});
