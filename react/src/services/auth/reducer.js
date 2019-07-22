const authReducer = (state = { username: '', userToken: '', userRole: '' }, action) => {
  switch (action.type) {
  case 'LOGIN':
    return {
      username: state.username,
      userToken: action.payload.userToken,
      userRole: state.userRole
    };
  case 'SETUSERNAME':
    return {
      username: action.payload.username,
      userToken: state.userToken,
      userRole: state.userRole
    };
  case 'LOGOUT':
    return { username: '', userToken: '', userRole: '' };
  default:
    return state;
  }
};

export default authReducer;
