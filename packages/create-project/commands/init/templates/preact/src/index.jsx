import { render } from 'preact';

let mount;
const root = document.getElementById('root');
const load = async () => {
  const { default: App } = await import('./App');

  mount = render(<App />, root, mount);
};

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept('./App', () => requestAnimationFrame(load));
}

load();
