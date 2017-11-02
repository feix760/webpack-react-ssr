
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import createStore from './store';
import { addCounter } from './action';
import Banner from './component/banner';
import './index.scss';

class Component extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render() {
    const { counter } = this.props;
    return (
      <div>
        <img src={ require('./image/logo.png') } alt="" />
        <p>Hello world, { counter.num }</p>
        <Banner></Banner>
      </div>
    );
  }
}

const Root = connect(state => {
  return state;

})(Component);

export function createElement(store) {
  return (
    <Provider store={ store }>
      <Root />
    </Provider>
  );
}

export {
  createStore,
};

export function fetchStore(store) {
  if (store.getState().counter.num === 0) {
    return store.dispatch(addCounter(5));
  } else {
    return Promise.resolve();
  }
}

function clientRender() {
  const store = createStore();

  ReactDOM.render(
    createElement(store),
    document.getElementById('root')
  );

  fetchStore(store);
}

if (typeof window !== 'undefined') {
  clientRender();
}
