/* eslint-disable no-console */

import firebase, { db } from '../firebase/firebase';


export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SETUSERNAME = 'SETUSERNAME';


console.log(db);
let usernameListener = db.collection('SGAccounts').doc('0') // default unset value
  .onSnapshot((doc) => {
    // eslint-disable-next-line no-console
    console.log('Current data: ', doc.data());
  });
console.log(usernameListener);

// ACTION GENERATORS
export function fetchAuth() {
  return (dispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // set up watcher on username for this user
        usernameListener(); // Remove previous listener
        usernameListener = db.collection('SGAccounts').doc(user.uid) // default unset value
          .onSnapshot((doc) => {
          // eslint-disable-next-line no-console
          // eslint-disable-next-line indent
          console.log('Current data: ', doc.data());
            dispatch({
              type: LOGIN,
              payload: { userToken: user.uid, userRole: 'admin' }
            });
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
// let usernameDoc = db.collection('SGAccounts').doc('');

// function fetchUsername() {
//   return (dispatch) => {
//     let usernameObs = firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         dispatch({
//           type: LOGIN,
//           payload: { userToken: user.uid, userRole: 'admin' }
//         });
//       } else {
//         // let state know that not logged in
//         dispatch({
//           type: LOGOUT
//         });
//         // try to log in
//         firebase.auth().signInAnonymously();
//       }
//     });
//   };
// }

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
