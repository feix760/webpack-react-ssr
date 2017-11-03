
export const ADD_COUNTER = 'ADD_COUNTER';

export function addCounter(num) {
  return function(dispatch) {
    return new Promise(resolve => {
      setTimeout(() => {
        const action = {
          type: ADD_COUNTER,
          data: num,
        };
        dispatch(action);
        resolve(action);
      }, 100);
    });
  };
}
