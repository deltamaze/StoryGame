import React from 'react';
import { connect } from 'react-redux';
import { setUsername } from '../services/auth/action';

class SignInPage extends React.Component {
  constructor(props) {
    super(props);


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.setUsername(event.target.value);
  }

  handleSubmit(event) {
    this.props.setUsername(event.target.value);
    event.preventDefault();
  }

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
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">
          Set Username
            <input type="text" id="username" value={this.props.auth.username} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h1>Current Token: {this.props.auth.userToken}</h1>
        {this.renderConnectingMsg()}
      </div>
    );
  }
}


export default connect(
  state => ({ auth: state.auth }),
  ({
    setUsername
  })
)(SignInPage);
