
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { ADD_COUNTER } from './action';

export default function() {
  const defaultCounter = {
    num: 0,
  };
  return createStore(
    combineReducers({
      counter: (state = defaultCounter, action) => {
        let { data } = action;
        switch (action.type) {
          case ADD_COUNTER:
            state.num += data;
            state = {
              ...state,
            };
            break;
        }
        return state;
      }
    }),
    typeof window !== 'undefined' && window.__initialState || {},
    applyMiddleware(thunkMiddleware)
  );
}
