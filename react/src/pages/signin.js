import React from 'react';
import { connect } from 'react-redux';
import { setUsername } from '../services/auth/action';
import debounce from '../utilities/debounce';

class SignInPage extends React.Component {
  static handleSubmit(event) { // eslint suggest static when this.xx not used
    event.preventDefault();
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.setUsernameWithDebouce = debounce(this.props.setUsername, 250);
    this.state = { userNameTextBox: '' };
  }

  handleChange(event) {
    this.setState({
      userNameTextBox: event.target.value
    });
    this.setUsernameWithDebouce(event.target.value);
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
        <h1>Current Local UN: {this.state.userNameTextBox}</h1>
        <h1>Current UN: {this.props.auth.username}</h1>
        <form onSubmit={SignInPage.handleSubmit}>
          <label htmlFor="username">
          Set Username
            <input type="text" id="username" value={this.state.userNameTextBox} onChange={this.handleChange} />
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
