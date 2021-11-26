import React from 'react';
import { render } from "react-dom"
import './index.css';
import { Provider } from "react-redux";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from 'store/configureStore';
import 'react-calendar/dist/Calendar.css';
import 'react-quill/dist/quill.snow.css'; 
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; 
const rootElement = document.getElementById("root")
render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
 
    <App />
    </PersistGate>
  </Provider>,
  rootElement
)
