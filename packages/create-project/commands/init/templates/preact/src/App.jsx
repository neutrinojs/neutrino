import { h, Component } from 'preact';
import './App.css';

export default class App extends Component {
  state = {
    name: '<%= data.name %>',
  };

  render() {
    const { name } = this.state;
    const message = `Welcome to ${name}`;

    return (
      <div class="App">
        <h1>{message}</h1>
      </div>
    );
  }
}
