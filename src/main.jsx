import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <App />
  </Provider>
  // <React.StrictMode>
  // </React.StrictMode>
)