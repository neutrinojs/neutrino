import { h, Component } from 'preact';
import './App.css';

export default class App extends Component {
  state = {
    name: '<%= data.name %>',
  };

  render() {
    const { name } = this.state;
    return (
      <div class="App">
        <h1>
          Welcome to
          {name}
        </h1>
      </div>
    );
  }
}
