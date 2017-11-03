
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { ADD_COUNTER } from './action';

export default function() {
  const defaultCounter = {
    num: 0,
    msg: '<p>Hello world</p>',
  };
  return createStore(
    combineReducers({
      counter: (state = defaultCounter, action) => {
        const { data } = action;
        switch (action.type) {
          case ADD_COUNTER:
            state.num += data;
            state = {
              ...state,
            };
            break;
          default:
            break;
        }
        return state;
      },
    }),
    typeof window !== 'undefined' && window.__initialState || {},
    applyMiddleware(thunkMiddleware)
  );
}
