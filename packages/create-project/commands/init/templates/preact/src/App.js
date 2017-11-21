import { h, Component } from 'preact';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div class="App">
        <h1>{'Welcome to <%= data.directory %>'}</h1>
      </div>
    );
  }
}
