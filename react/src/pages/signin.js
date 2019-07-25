import React from 'react';
import { connect } from 'react-redux';


class SignInPage extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  renderConnectingMsg() {
    if (this.props.auth.userToken === '') {
      return <div>Connecting to Auth Service...</div>;
    } if (this.props.auth.userToken !== '') {
      return <div>Set Username</div>;
    }
    return null;
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <h1>Current UN: {this.props.auth.username}</h1>
        <h1>Current Token: {this.props.auth.userToken}</h1>
        {this.renderConnectingMsg()}
      </div>
    );
  }
}


export default connect(
  state => ({ auth: state.auth }),
  ({
  })
)(SignInPage);
