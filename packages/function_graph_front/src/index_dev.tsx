import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "reactflow/dist/style.css"
import { App } from './App';
import { DevProvider } from './graph_providers/DevProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <App provider={new DevProvider()} />
  </React.StrictMode>
);