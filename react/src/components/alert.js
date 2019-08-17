import React from 'react';
import { connect } from 'react-redux';
import { dismissAlert } from '../services/alerts/action';

// eslint-disable-next-line react/prefer-stateless-function
class AlertBanner extends React.Component {
  render() {
    return (
      <div>Alert: {this.props.alert.alertMsg}</div>
    );
  }
}

export default connect(
  state => ({ alert: state.alert }),
  ({
    dismissAlert
  })
)(AlertBanner);
