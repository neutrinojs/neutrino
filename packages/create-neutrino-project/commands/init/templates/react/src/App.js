import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>{'Welcome to <%= data.directory %>'}</h1>
      </div>
    );
  }
}
