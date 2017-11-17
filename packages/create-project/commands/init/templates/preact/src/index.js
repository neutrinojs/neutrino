import { h, render } from 'preact';

let root;

const load = () => {
  const App = require('./App').default;

  root = render(<App />, document.getElementById('root'), root);
};

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./App', () => requestAnimationFrame(load));
}

load();
