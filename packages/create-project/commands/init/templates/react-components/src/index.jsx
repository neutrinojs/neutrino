/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-dom';
import HelloWorld from './components/HelloWorld';

const root = document.getElementById('root');

render((
  <HelloWorld />
), root);
