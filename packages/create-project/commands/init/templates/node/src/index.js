import { createServer } from 'http';
import app from './app';

const port = process.env.PORT || 3000;

if (module.hot) {
  module.hot.accept('./app');
}

createServer((request, response) => response.end(app()))
  .listen(port, () => console.log(`Running on :${port}`));
