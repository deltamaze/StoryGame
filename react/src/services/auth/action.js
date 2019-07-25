
import firebase from '../firebase/firebase';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SETUSERNAME = 'SETUSERNAME';

// ACTION GENERATORS
export function fetchAuth() {
  return (dispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: LOGIN,
          payload: { userToken: user.uid, userRole: 'admin' }
        });
      } else {
        // let state know that not logged in
        dispatch({
          type: LOGOUT
        });
        // try to log in
        firebase.auth().signInAnonymously();
      }
    });
  };
}

export function login() {
  return () => firebase.auth().signInAnonymously();
}
export function setUsername(username) {
  return (dispatch) => {
    dispatch({
      type: SETUSERNAME,
      payload: { username }
    });
  };
}

export function logout() {
  return () => firebase.auth().signOut();
}
