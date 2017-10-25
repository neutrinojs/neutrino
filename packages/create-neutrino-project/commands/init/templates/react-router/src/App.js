import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';

import AsyncFoo from './components/Foo';
import AsyncBar from './components/Bar';
import AsyncHome from './components/Home';

const App = () => (
  <Router>
    <div className="App">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/foo">Foo</Link></li>
        <li><Link to="/bar">Bar</Link></li>
      </ul>

      <Route exact path="/" component={AsyncHome} />
      <Route path="/foo" component={AsyncFoo} />
      <Route path="/bar" component={AsyncBar} />
    </div>
  </Router>
);

export default App;
