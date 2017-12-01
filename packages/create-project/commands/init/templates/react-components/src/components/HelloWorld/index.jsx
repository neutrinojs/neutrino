import { PureComponent } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import { string } from 'prop-types'; // eslint-disable-line import/no-extraneous-dependencies

const generateColor = () => `#${
  (0x1000000 + ((Math.random()) * 0xffffff))
    .toString(16)
    .substr(1, 6)
}`;

export default class HelloWorld extends PureComponent {
  static defaultProps = {
    initialColor: '#000'
  };

  static propTypes = {
    initialColor: string
  };

  state = {
    color: this.props.initialColor
  };

  componentWillReceiveProps({ initialColor }) {
    if (initialColor !== this.props.initialColor) {
      this.setState({ color: initialColor });
    }
  }

  handleClick = () => {
    this.setState({
      color: generateColor()
    });
  };

  render() {
    return (
      <div>
        <h1 style={{ color: this.state.color, padding: '20px' }}>Hello World!</h1>
        <button onClick={this.handleClick}>Change color</button>
      </div>
    );
  }
}
