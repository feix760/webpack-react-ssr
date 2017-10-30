
import React from 'react';
import './index.scss';

export default class Banner extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <p>Banner</p>
        <img src={ require('./images/logo.png') } alt="" />
      </div>
    );
  }
}

if (module.hot) {
  module.hot.accept();
}
