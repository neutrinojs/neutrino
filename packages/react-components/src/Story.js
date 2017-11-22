import { PureComponent } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import { func } from 'prop-types';

export default class Story extends PureComponent {
  static propTypes = {
    component: func.isRequired
  };

  render() {
    return null;
  }
}
