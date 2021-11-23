import React from 'react';
import { render } from "react-dom"
import './index.css';
import { Provider } from "react-redux";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from 'store/configureStore';

const rootElement = document.getElementById("root")
render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
 
    <App />
    </PersistGate>
  </Provider>,
  rootElement
)
