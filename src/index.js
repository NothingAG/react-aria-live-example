import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import polyfills from './polyfills';

polyfills();
ReactDOM.render(<App />, document.getElementById('root'));
