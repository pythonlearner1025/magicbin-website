import React from 'react';
import ReactDOM from 'react-dom';
import Dapp from './Dapp/DappTrashClub';
import reportWebVitals from './reportWebVitals';
import {Routes, Route} from 'react-router-dom';
import {Fail} from './Dapp/Fail.js';
import './App.css';

ReactDOM.render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
