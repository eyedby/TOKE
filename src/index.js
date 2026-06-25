import React from 'react';
import ReactDOM from 'react-dom/client';
import TugOfWarDashboard from './TugOfWarDashboard';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <TugOfWarDashboard />
    </React.StrictMode>
  );
}
