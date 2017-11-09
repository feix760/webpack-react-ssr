
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class Component extends React.Component {
  render() {
    return (
      <div>Hello world, List</div>
    );
  }
}

export function createElement() {
  return (
    <Component></Component>
  );
}

if (typeof window !== 'undefined' && window.HTMLElement) {
  ReactDOM[ window.__initialState ? 'hydrate' : 'render' ](
    createElement(),
    document.getElementById('root')
  );
}

