/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-dom';
import { Stories, Story, Props } from '@neutrinojs/react-components/lib';
import HelloWorld from './components/HelloWorld';

const root = document.getElementById('root');

render((
  <Stories>
    <Story component={HelloWorld}>
      <Props name="Default" />
      <Props name="Start green" initialColor="#0f0" />
      <Props name="Start red" initialColor="#f00" />
    </Story>
  </Stories>
), root);
