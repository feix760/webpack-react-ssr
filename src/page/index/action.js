
export const ADD_COUNTER = 'ADD_COUNTER';

export function addCounter(num) {
  return function(dispatch) {
    return new Promise(resolve => {
      /**
       * server render also support:
       * fetch api on server render
       * use location.href to get query param
       */
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
