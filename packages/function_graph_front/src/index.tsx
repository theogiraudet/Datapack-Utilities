import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "reactflow/dist/style.css"
import { App } from './App';
import VsCodeSource from './graph_providers/VsCodeSource';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <App provider={new VsCodeSource()} />
  </React.StrictMode>
);