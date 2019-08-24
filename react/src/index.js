import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import PageRouter from './components/router';
import store from './store';
import StoreProvider from './storeProvider';
import NavBar from './components/navbar';
import FirebaseServiceStarter from './components/firebaseServiceStarter';
import AlertBanner from './components/alert';

ReactDOM.render(
  <Provider store={store}>
    <StoreProvider>
      <BrowserRouter>
        <AlertBanner>
          <FirebaseServiceStarter />
          <NavBar />
          <PageRouter />
        </AlertBanner>
      </BrowserRouter>
    </StoreProvider>
  </Provider>, document.querySelector('.container')
);
