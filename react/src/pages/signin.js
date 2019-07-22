import React from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../services/auth/action';


class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.content = <div>Loading...</div>;
    if (this.props.auth.userToken === '') {
      this.content = <div>Connecting to Auth Service...</div>;
    }
    if (this.props.auth.userToken !== '') {
      this.content = <div>Set Username</div>;
    }
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <button onClick={this.props.login}>Login</button>
        <button onClick={this.props.logout}>Logout</button>
        <h1>Current UN: {this.props.auth.username}</h1>
        <h1>Current Token: {this.props.auth.userToken}</h1>
        {this.renderConnectingMsg()}
        <br />
        {this.content}
      </div>
    );
  }
}


export default connect(
  state => ({ auth: state.auth }),
  ({
    login, logout
  })
)(SignInPage);
