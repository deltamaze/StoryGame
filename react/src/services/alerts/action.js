import store from '../../store';

export const NEWALERT = 'NEWALERT';
export const DISMISS = 'DISMISS';


export function setAlert(alertMsg) {
  // return (dispatch) => {
  //   dispatch({
  //     type: NEWALERT,
  //     payload: { alertMsg }
  //   });
  // };
  store.dispatch(
    {
      type: NEWALERT,
      payload: { alertMsg}
    }
  );
  // console.log('checkpoint1');
  // return (dispatch) => {
  //   console.log('checkpoint2');
  //   dispatch({
  //     type: NEWALERT,
  //     payload: { alertMsg }
  //   });
  // };
}

export function dismissAlert() {
  return (dispatch) => {
    dispatch({
      type: DISMISS
    });
  };
}
