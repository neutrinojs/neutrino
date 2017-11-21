import { PureComponent } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import { string } from 'prop-types';

export default class Props extends PureComponent {
  static propTypes = {
    name: string.isRequired
  };

  render() {
    return null;
  }
}
