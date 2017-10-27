import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

import AsyncHome from './components/Home';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>

          <Route exact path="/" component={AsyncHome} />
        </div>
      </BrowserRouter>
    );
  }
}
