import React from 'react';
import ReactDOM from 'react-dom/client';
import { MockStateProvider } from '@bluerobins/api';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MockStateProvider>
      <App />
    </MockStateProvider>
  </React.StrictMode>
);
