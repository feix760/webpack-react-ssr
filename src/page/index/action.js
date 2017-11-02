
export const ADD_COUNTER = 'ADD_COUNTER';

export function addCounter(num) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const action = {
          type: ADD_COUNTER,
          data: num,
        };
        dispatch(action);
        resolve(action);
      }, 100);
    });
  }
}
