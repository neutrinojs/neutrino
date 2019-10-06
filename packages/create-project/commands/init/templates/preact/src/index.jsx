import { h, render } from 'preact';

const root = document.getElementById('root');
const load = async () => {
  const { default: App } = await import('./App');

  render(<App />, root);
};

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./App', () => requestAnimationFrame(load));
}

load();
