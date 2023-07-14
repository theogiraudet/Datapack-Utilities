import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppDev } from './AppDev';
import "reactflow/dist/style.css"

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <AppDev />
  </React.StrictMode>
);