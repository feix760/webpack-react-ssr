
import React from 'react';
import ReactDOM from 'react-dom';
import Banner from './banner';
import './index.scss';

class Page extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <img src={ require('./images/logo.png') } alt="" />
        <p>Hello world</p>
        <Banner></Banner>
      </div>
    );
  }
}

ReactDOM.render(
  <Page></Page>,
  document.getElementById('root')
);

