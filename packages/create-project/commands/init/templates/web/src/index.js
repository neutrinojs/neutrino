const rootEl = document.getElementById('root');

rootEl.innerHTML = '<div style="padding: 20px"><h1>Welcome to <%= data.directory %></h1></div>';

// This is needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
