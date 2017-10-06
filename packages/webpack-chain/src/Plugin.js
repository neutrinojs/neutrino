const ChainedMap = require('./ChainedMap');
const Orderable = require('./Orderable');

module.exports = Orderable(class extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.extend(['init']);

    this.init((Plugin, args = []) => new Plugin(...args));
  }

  use(plugin, args = []) {
    return this
      .set('plugin', plugin)
      .set('args', args);
  }

  tap(f) {
    this.set('args', f(this.get('args') || []));
    return this;
  }

  merge(obj, omit = []) {
    if ('plugin' in obj) {
      this.set('plugin', obj.plugin);
    }

    if ('args' in obj) {
      this.set('args', obj.args);
    }

    return super.merge(obj, [...omit, 'args', 'plugin']);
  }

  toConfig() {
    const init = this.get('init');

    return init(this.get('plugin'), this.get('args'));
  }
});
