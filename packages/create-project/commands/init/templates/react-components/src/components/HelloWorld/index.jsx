import React, { PureComponent } from 'react';
import { string } from 'prop-types';

const generateColor = () => `#${
  (0x1000000 + ((Math.random()) * 0xffffff))
    .toString(16)
    .substr(1, 6)
}`;

export default class HelloWorld extends PureComponent {
  static propTypes = {
    initialColor: string
  };

  static defaultProps = {
    initialColor: '#000'
  };

  constructor(props) {
    super(props);
    this.state = { color: props.initialColor };
  }

  handleClick = () => {
    this.setState({
      color: generateColor()
    });
  };

  render() {
    const { color } = this.state;
    return (
      <div>
        <h1 style={{ color, padding: '20px' }}>
          Hello World!
        </h1>
        <button type="button" onClick={this.handleClick}>
          Change color
        </button>
      </div>
    );
  }
}
