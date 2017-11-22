
import React from 'react';
import './index.scss';

export default class Banner extends React.Component {
  onClick = () => {
    console.log('banner click');
  }

  render() {
    return (
      <div className="banner-container">
        <p>Banner</p>
        <div className="image" onClick={ this.onClick }></div>
      </div>
    );
  }
}
