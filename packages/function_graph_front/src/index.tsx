import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "reactflow/dist/style.css"
import { App } from './App';
import VsCodeProvider from './graph_providers/VsCodeProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <App provider={new VsCodeProvider()} />
  </React.StrictMode>
);