import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@chatui/core/es/styles/index.less';
import '@chatui/core/dist/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);