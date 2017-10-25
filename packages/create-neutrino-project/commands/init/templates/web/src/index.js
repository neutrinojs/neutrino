const rootEl = document.getElementById('root');

rootEl.innerHTML = '<div style="padding: 20px"><h1>Neutrino</h1><p>Welcome to Web</p></div>';

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
