import React from 'react';

export default class HelloWorld extends React.PureComponent {
  static defaultProps = {
    initialColor: '#000'
  };

  constructor(props) {
    super(props);

    this.state = {
      color: this.props.initialColor
    };
  }

  componentWillReceiveProps({ initialColor }) {
    if (initialColor !== this.props.initialColor) {
      this.setState({ color: initialColor });
    }
  }

  generateColor() {
    return `#${(0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`;
  }

  handleClick = () => {
    this.setState({
      color: this.generateColor()
    });
  };

  render() {
    return (
      <h1 onClick={this.handleClick} style={{ color: this.state.color, padding: '20px' }}>
        Hello World! (click me)
      </h1>
    );
  }
}
