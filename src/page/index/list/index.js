
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class Page extends React.Component {
  render() {
    return (
      <div>Hello world, List</div>
    );
  }
}

export function createElement() {
  return (
    <Page></Page>
  );
}

if (typeof window !== 'undefined') {
  ReactDOM.render(
    createElement(),
    document.getElementById('root')
  );
}

