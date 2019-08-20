import React from 'react';
import { connect } from 'react-redux';
import { dismissAlert } from '../services/alerts/action';

// eslint-disable-next-line react/prefer-stateless-function
class AlertBanner extends React.Component {
  render() {
    if (!this.props.alert.dismissed) {
      return (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>Unexpected Error Occured =&gt; {this.props.alert.alertMsg}</p>
          <button type="button" className="close" aria-label="Close" onClick={this.props.dismissAlert}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }
    return null; // else condition
  }
}
export default connect(
  state => ({ alert: state.alert }),
  ({
    dismissAlert
  })
)(AlertBanner);
