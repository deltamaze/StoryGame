import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import SignInPage from './signin';
import PrivateRoute from '../components/privateRoute';


// HomeScreen
const HomeScreen = () => <h1>Hello</h1>;
// 404Screen
const NotFoundScreen = () => <h1>404</h1>;
// Counter


let CounterScreen = props => (
  <div>
    <h1>Counter: {props.counter}</h1>
    <button onClick={props.increment}>Increment</button>
    <button onClick={props.decrement}>Decrement</button>
  </div>
);
CounterScreen = connect(
  state => ({ counter: state.counter }),
  dispatch => ({
    increment: () => dispatch({ type: 'INC' }),
    decrement: () => dispatch({ type: 'DEC' })
  })
)(CounterScreen);

// pagesrouter

class PageRouter extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
    // this.props.fetchAuth();
  }


  renderSwitch() {
    if (this.props.auth.userToken === '') {
      return (
        <div>Loading...</div>
      );
    } if (this.props.auth.userToken !== '') {
      return (
        <div>
          <Switch>
            <Route path="/" exact component={HomeScreen} />
            <PrivateRoute path="/counter" component={CounterScreen} />
            <Route path="/signin" component={SignInPage} />
            <Route path="*" component={NotFoundScreen} />
          </Switch>
        </div>
      );
    }
    return null;
  }


  render() {
    return (
      this.renderSwitch()
    );
  }
}


export default connect(
  state => ({ auth: state.auth }),
  ({
  })
)(PageRouter);
