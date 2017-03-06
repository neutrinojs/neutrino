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

test('tap empty', t => {
  const plugin = new Plugin(StringifyPlugin);

  plugin.tap(args => {
    t.deepEqual(args, []);
    return ['alpha', 'beta'];
  });

  t.deepEqual(plugin.args, ['alpha', 'beta']);
});

test('tap with values', t => {
  const plugin = new Plugin(StringifyPlugin, ['alpha']);

  plugin.tap(args => {
    t.deepEqual(args, ['alpha']);
    return [...args, 'beta'];
  });

  t.deepEqual(plugin.args, ['alpha', 'beta']);
});

test('init empty', t => {
  const plugin = new Plugin(StringifyPlugin);
  const instance = plugin.init(plugin.plugin, plugin.args);

  t.true(instance instanceof StringifyPlugin);
});

test('init with values', t => {
  const plugin = new Plugin(StringifyPlugin, ['alpha', 'beta']);
  const instance = plugin.init(plugin.plugin, plugin.args);

  t.true(instance instanceof StringifyPlugin);
  t.deepEqual(instance.values, plugin.args);
});

test('inject', t => {
  const plugin = new Plugin(StringifyPlugin, ['alpha', 'beta']);

  plugin.inject((plugin, args) => new StringifyPlugin('gamma'));
  t.deepEqual(plugin.init(plugin.plugin, plugin.args).values, ['gamma']);
});
