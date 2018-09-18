import test from 'ava';
import Neutrino from '../../neutrino/Neutrino';

const mw = () => require('..');
const options = { css: { modules: true }, style: { sourceMap: true } };

test('loads middleware', t => {
  t.notThrows(mw);
});

test('uses middleware', t => {
  t.notThrows(() => new Neutrino().use(mw()));
});

test('uses with options', t => {
  t.notThrows(() => new Neutrino().use(mw(), options));
});

test('instantiates', t => {
  const api = new Neutrino();

  api.use(mw());

  t.notThrows(() => api.config.toConfig());
});

test('instantiates with options', t => {
  const api = new Neutrino();

  api.use(mw(), options);

  t.notThrows(() => api.config.toConfig());
});

test('uses CSS modules by default', t => {
  const api = new Neutrino();

  api.use(mw());

  t.true(api.config.module.rules.has('style-modules'));

  const options = api.config.module
    .rule('style-modules')
    .use('css-modules')
    .get('options');

  t.truthy(options && options.modules);
});

test('respects disabling of CSS modules', t => {
  const api = new Neutrino();

  api.use(mw(), { modules: false });

  t.false(api.config.module.rules.has('style-modules'));

  const style = api.config.module.rule('style').toConfig();

  style.use.forEach(use => {
    t.falsy(use.options && use.options.css && use.options.css.modules);
  });
});
